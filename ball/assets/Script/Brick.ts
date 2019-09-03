import { WallManager } from "./WallManager";
import { Wall } from "./Wall";

const { ccclass, property } = cc._decorator;

@ccclass
export class Brick extends cc.Component {

    @property(cc.Label)
    private label: cc.Label = null;
    private num: number = 15;
    public onLoad(): void {
        this.label.string = this.num.toString();
        this.node.on("kick", this.onKick, this);
    }
    public onKick(): void {
        this.num--;
        this.label.string = this.num.toString();
        if (this.num <= 0) {
            this.onZero();
            return;
        }
    }
    public onZero(): void {
        // this.node.isValid = false;
        const index: number = this.node.parent.getComponent(Wall).mChildrens.indexOf(this.node);
        this.node.parent.getComponent(Wall).mChildrens[index] = undefined;
        this.node.destroy();
        cc.find("Canvas/walls").getComponent(WallManager).needUpdate = true;
        cc.find("Canvas/walls").getComponent(WallManager).needDisposeWall.push(this.node.parent.getComponent(Wall));
    }
}
