const { ccclass, property } = cc._decorator;

@ccclass
export class Wall extends cc.Component {
    @property
    public isOutWall: boolean = false;
    private mChildrens: cc.Node[] = [];
    public onLoad(): void {
        this.getComponent(cc.Layout).enabled = false;
        for (let i: number = 0; i < this.node.children.length; i++) {
            this.mChildrens.push(this.node.children[i]);
        }

        if (this.isOutWall) {
            return;
        }
        this.getComponent(cc.RigidBody).enabledContactListener = true;
    }
    // public onPreSolve(): void {
    //     console.log("onPreSolve");
    // }
    // public onPostSolve(): void {
    //     console.log("onPostSolve");
    // }
    public onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsBoxCollider, otherCollider: cc.PhysicsCircleCollider): void {
        // 如果可以不用获取世界坐标系下的点然后再转换到本地坐标系应该可以提高性能
        const contacktPointLocal: cc.Vec2 = this.node.convertToNodeSpaceAR(contact.getWorldManifold().points[0]);
        let index: number = Math.floor(contacktPointLocal.x / 30);
        if (index < 0) {
            index = 0;
        } else if (index >= this.node.children.length) {
            index = this.node.children.length - 1;
        }
        if (this.mChildrens[index] !== null && this.mChildrens[index] !== undefined && this.mChildrens[index].isValid === true) {
            this.mChildrens[index].emit("kick");
        }
    }
}
