const { ccclass, property } = cc._decorator;

@ccclass
export class Brick extends cc.Component {

    @property(cc.Label)
    private label: cc.Label = null;
    private num: number = 2;
    public onLoad(): void {
        this.label.string = this.num.toString();
        this.node.on("kick", this.onKick, this);
    }
    public onKick(): void {
        this.num--;
        if (this.num <= 0) {
            this.onZero();
            return;
        }
        this.label.string = this.num.toString();
    }
    public onZero(): void {
        this.node.destroy();
    }
}
