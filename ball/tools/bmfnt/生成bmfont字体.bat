@set tempDir=%~dp0tempZip
if exist %tempDir% rd /q /s %tempDir%
cd "./ChineseCharCollector/ChineseCharCollector/bin/Debug/"
call "ChineseCharCollector.exe"