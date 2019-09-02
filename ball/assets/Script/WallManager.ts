import { Wall } from "./Wall";

const { ccclass, property } = cc._decorator;

@ccclass
export class WallManager extends cc.Component {
    @property(cc.Node)
    private wallTemplate:cc.Node = null;
    public needUpdate: boolean = false;
    public needDisposeWall:Wall[] = [];
    public lateUpdate(): void {
        if (this.needUpdate === false) {
            return;
        }
        for(let i:number = 0;i< this.needDisposeWall.length;i++){
            if(this.needDisposeWall[i] !== null && this.needDisposeWall[i] !== undefined && this.needDisposeWall[i].isValid === true){
                this.needDisposeWall[i].dispose();
            }
        }
        this.needDisposeWall = [];
    }
}
