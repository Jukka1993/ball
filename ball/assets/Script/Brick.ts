import { WallManager } from "./WallManager";
import { Wall } from "./Wall";

const { ccclass, property } = cc._decorator;

@ccclass
export class Brick extends cc.Component {

    @property(cc.Label)
    private label: cc.Label = null;
    private num: number = 3;
    public onLoad(): void {
        this.label.string = this.num.toString();
        this.changeLabelToNumLayer(); // 如果启动卡顿的话,可能需要分帧处理
        this.node.on("kick", this.onKick, this);
    }
    public changeLabelToNumLayer(): void {
        const numLayer: cc.Node = cc.find("Canvas/NumLayer");
        const pos: cc.Vec2 = numLayer.convertToNodeSpaceAR(this.label.node.convertToWorldSpaceAR(cc.v2(0, 0)));
        this.label.node.setParent(numLayer);
        this.label.node.setPosition(pos);
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
        if (this.label !== null && this.label !== undefined) {
            this.label.destroy();
        }
        cc.find("Canvas/walls").getComponent(WallManager).needUpdate = true;
        cc.find("Canvas/walls").getComponent(WallManager).needDisposeWall.push(this.node.parent.getComponent(Wall));
    }
}
