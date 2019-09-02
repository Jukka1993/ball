using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Text.RegularExpressions;
using System.Windows.Forms;
using System.Diagnostics;
using System.IO.Compression;

namespace ConsoleApplication2
{
    class Program
    {
        static bool containsPrefab = false;
        static bool containsConfig = false;
        static bool containsScript = false;
        //static string specialChar = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~`!%*()_+-={}[]|\\:;\"'<,>.?/【】——";
        //用于去掉不需要的字，如日志，注释里面的东西
        static string[] spe = new string[] { "//", "@property", "console.log", "console.error", "console.warn", " * ", "/**", "LogUtil." };

        /**********************************************************************************/
        static string specialCharsPath = @"..\..\..\..\specialChars.txt";
        static string fontFntPath = @"..\..\..\..\mainfnt.fnt";
        static string tempZipDir = @"..\..\..\..\tempZip";
        static string fontFntPathTemp = @"..\..\..\..\mainfntTemp.fnt";
        static string prefabFolder = @"..\..\..\..\..\..\assets\resources\prefab";
        static string tsFolder = @"..\..\..\..\..\..\assets\scripts";
        static string configFolder = @"..\..\..\..\..\..\assets\resources\configs";
        static string txtPath = @"..\..\..\..\mainfnt.txt";
        static string bmFontPathFile = @".\bmFontPath.txt";
        /// <summary>
        /// spe 为分隔符字符串，分割后取第一个子串进行检测引号内的中文
        /// folder为需要处理的文件夹
        /// @"C:\Users\Administrator\Desktop\textContent.txt"为要放到 language.lua 里 Language.Text = {}的{}中的内容
        /// </summary>
        static List<string> fileNameList = new List<string>();
        [STAThreadAttribute]
        static void Main(string[] args)
        {
            string bmFontExePath = "";
            bool existBMFont = false;
            if (File.Exists(bmFontPathFile))
            {
                StreamReader sr = new StreamReader(bmFontPathFile);
                bmFontExePath = sr.ReadLine();
                string[] temp = bmFontExePath.Split('"');
                sr.Close();
                if (File.Exists(temp[1]))
                {
                    existBMFont = true;
                }
            }
            if(existBMFont != true)
            {
                File.Create(bmFontPathFile).Close();
                //选择BMFONT文件目录
                OpenFileDialog fd = new OpenFileDialog();
                fd.Filter = "EXE文件(*.exe)|*.exe";
                fd.Title = "选择BMFont.exe程序";
                if (fd.ShowDialog() == DialogResult.OK)
                {
                    Console.WriteLine("选择文件");
                    StreamWriter sw = new StreamWriter(bmFontPathFile, false, new System.Text.UTF8Encoding(true));  //使用utf8-BOM编码
                    StringBuilder sb = new StringBuilder();
                    sb.Append("\"");
                    sb.Append(fd.FileName);
                    sb.Append("\"");
                    sw.Write(sb.ToString());
                    sw.Close();
                    Console.WriteLine("bmFont.exe路径为 {0}", sb.ToString());
                    bmFontExePath = sb.ToString();
                }
            }

            Dictionary<string, bool> charDic = new Dictionary<string, bool>();
            StringBuilder languageText = new StringBuilder();
            StringBuilder fileContent = new StringBuilder();
            if (containsPrefab)
            {
                AddAllSpecifiedFile(prefabFolder, "*.prefab");
            }
            if (containsScript)
            {
                AddAllSpecifiedFile(tsFolder, "*.ts");
            }
            if (containsConfig)
            {
                AddAllSpecifiedFile(configFolder, "*.csv");
            } else
            {
                //AddZipCsvFile(configFolder, "*.db");
                //AddZipCsvFile(configFolder, "*.binary");
            }
            foreach (string filePath in fileNameList)
            {
                Console.WriteLine("===>{0}", filePath);
                //string regexStr = "(\"[^\"]*[\u4e00-\u9fa5]+[^\"]*\")|('[^']*[\u4e00-\u9fa5]+[^']*')"
                string regexStr = "(\"[^\"]*[\u4e00-\u9fa5]+[^\"]*\")|('[^']*[\u4e00-\u9fa5]+[^']*')|(`[^`]*[\u4e00-\u9fa5]+[^`]*`)";
                if (filePath.Contains(".csv"))
                {
                    regexStr = "[\u4e00-\u9fa5]";
                }
                string[] fileLines = File.ReadAllLines(filePath);
                for (int i = 0; i < fileLines.Length; i++)
                {
                    string[] split_strings = fileLines[i].Split(spe, StringSplitOptions.None);

                    MatchCollection matches = Regex.Matches(split_strings[0], regexStr);
                    if (matches.Count <= 0)
                    {
                        continue;
                    }
                    foreach (var mathStr in matches)
                    {
                        List<char> charList = mathStr.ToString().ToList<char>();
                        foreach (char character in charList)
                        {
                            string temp = character.ToString();
                            MatchCollection matches1 = Regex.Matches(temp, "[\u4300-\u9fa5]");
                            if (matches1.Count <= 0)
                            {
                                continue;
                            }
                            //Console.Write(temp);
                            if (charDic.ContainsKey(temp))
                            {
                                continue;
                            }
                            charDic[temp] = true;
                            languageText.Append(temp);
                        }

                    }
                }
                Console.WriteLine("");
            }
            if (!File.Exists(txtPath))
            {
                File.Create(txtPath).Close();
            }
            StreamReader sr1 = new StreamReader(specialCharsPath, Encoding.Default);
            string specialChars = sr1.ReadToEnd();
            languageText.Append(specialChars);
            sr1.Close();
            StreamWriter sw1 = new StreamWriter(txtPath, false, new System.Text.UTF8Encoding(true));  //使用utf8-BOM编码
            sw1.Write(languageText.ToString());
            sw1.Close();
            int index = 0;
            while (File.Exists(@"..\..\..\..\mainfnt_" + index + ".png"))
            {
                File.Delete(@"..\..\..\..\mainfnt_" + index + ".png");
                index++;
            }
            Process proc = new Process();
            string targetDir = string.Format(@".\");
            proc.StartInfo.WorkingDirectory = targetDir;
            proc.StartInfo.FileName = "genBMFont.bat";
            Console.WriteLine("bmFontExePath======{0}", bmFontExePath);
            proc.StartInfo.Arguments = string.Format(bmFontExePath);
            proc.Start();
            proc.WaitForExit();
            //todo
            StreamReader reader = new StreamReader(fontFntPath, Encoding.Default);
            String fntContent = reader.ReadToEnd();
            fntContent = fntContent.Replace("size=-", "size=");
            StreamWriter readTxt = new StreamWriter(fontFntPathTemp, false, Encoding.Default);
            readTxt.Write(fntContent);
            readTxt.Flush();
            readTxt.Close();
            reader.Close();
            File.Copy(fontFntPathTemp,fontFntPath, true);
            File.Delete(fontFntPathTemp);

            Console.WriteLine("Done!");
            Console.ReadKey();

        }
        /// <summary>
        /// 将指定目录下的所有指定后缀名的文件名添加到 fileNameList 中去
        /// </summary>
        /// <param name="folderName">目录</param>
        /// <param name="str">指定后缀名</param>
        static void AddAllSpecifiedFile(string folderName, string str)
        {
            if (!Directory.Exists(folderName))
            {
                Console.WriteLine("Specific folder not exist!");
            }
            string[] fileNames = Directory.GetFiles(folderName, str);//"*.lua.bytes"
            foreach (string fileName in fileNames)
            {
                fileNameList.Add(fileName);
            }
            string[] subfolderNames = Directory.GetDirectories(folderName);
            foreach (string subfolderName in subfolderNames)
            {
                AddAllSpecifiedFile(subfolderName, str);
            }
        }

        static void AddZipCsvFile(string folderName, string str)
        {
            if (Directory.Exists(tempZipDir))
            {
                Directory.Delete(tempZipDir,true);
            }
            Directory.CreateDirectory(tempZipDir);
            if (!Directory.Exists(folderName))
            {
                Console.WriteLine("Specific folder not exist!");
            }
            string[] fileNames = Directory.GetFiles(folderName, str);//"*.lua.bytes"
            foreach (string fileName in fileNames)
            {
                //if (fileName.Contains(".db"))
                //{
                //    string baseName = Path.GetFileName(fileName);
                //    ZipFile.ExtractToDirectory(fileName, Path.Combine(tempZipDir, baseName));
                //}
                if (fileName.Contains(".binary"))
                {
                    string baseName = Path.GetFileName(fileName);
                    ZipFile.ExtractToDirectory(fileName, Path.Combine(tempZipDir, baseName));
                }
            }
            AddAllSpecifiedFile(tempZipDir, "*.csv");
        }
    }
}
