const { ccclass, property } = cc._decorator;

@ccclass
export class Main extends cc.Component {
    private visualBoard: cc.Node = null;
    private touchBoard: cc.Node = null;
    private rigidBoard: cc.Node = null;
    public onLoad(): void {
        const manager: cc.PhysicsManager = cc.director.getPhysicsManager();
        manager.enabled = true;
        manager.gravity = cc.v2(0, 0);
        manager.enabledAccumulator = true;
        console.log("球数为", cc.find("Canvas/balls").childrenCount * 3);
        this.visualBoard = cc.find("Canvas/VisualBoard");
        this.touchBoard = cc.find("Canvas/TouchBoard");
        this.rigidBoard = cc.find("Canvas/Board");
        this.touchBoard.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }
    public update(): void {
        const deltaX: number = this.visualBoard.x - this.rigidBoard.x;
        const deltaY: number = this.visualBoard.y - this.rigidBoard.y;
        const effectiveX: number = Math.abs(deltaX) > 5 ? deltaX : 0;
        const effectiveY: number = Math.abs(deltaY) > 5 ? deltaY : 0;
        if (effectiveX === 0 && effectiveY === 0) {
            this.rigidBoard.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            return;
        }
        this.rigidBoard.getComponent(cc.RigidBody).linearVelocity = cc.v2(effectiveX * 30, effectiveY * 30);
    }
    private onTouchMove(touch: cc.Event.EventTouch): void {
        const newX: number = this.visualBoard.x + touch.getDeltaX();
        const newY: number = this.visualBoard.y + touch.getDeltaY();
        const halfWidth: number = this.visualBoard.width * this.visualBoard.scaleX / 2;
        let finalX: number = this.visualBoard.x;
        let finalY: number = this.visualBoard.y;
        if ((newX > 0 && newX + halfWidth <= 320) || (newX < 0 && newX - halfWidth >= -320)) {
            finalX = newX;
        }
        if (newY > this.touchBoard.y && newY < this.touchBoard.y + this.touchBoard.height) {
            finalY = newY;
        }
        this.visualBoard.setPosition(finalX, finalY);
    }
}
