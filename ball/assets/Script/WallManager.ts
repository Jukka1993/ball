const { ccclass, property } = cc._decorator;

@ccclass
export class WallManager extends cc.Component {
    public needUpdate: boolean = false;
    public lateUpdate(): void {
        if (this.needUpdate === false) {
            return;
        }
    }
}
