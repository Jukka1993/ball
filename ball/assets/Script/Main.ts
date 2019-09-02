const { ccclass, property } = cc._decorator;

@ccclass
export class Main extends cc.Component {
    public onLoad(): void {
        // const manager: cc.CollisionManager = cc.director.getCollisionManager();
        // manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;
        const manager: cc.PhysicsManager = cc.director.getPhysicsManager();
        manager.enabled = true;
        manager.gravity = cc.v2(0, 0);
        manager.enabledAccumulator = true;
    }
}
