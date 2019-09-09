const { ccclass, property } = cc._decorator;

@ccclass
export class Ball extends cc.Component {
    private rigidbody: cc.RigidBody = null;
    // private speedX: number = 10;
    // private speedY: number = 5;
    // private speed: cc.Vec2 = cc.v2(1, 0);
    // private direct: number = 1;
    // private lastOther: cc.Collider = null;
    public onLoad(): void {
        this.rigidbody = this.getComponent(cc.RigidBody);
        this.rigidbody.enabledContactListener = true;
        // this.node.getComponent(cc.CircleCollider).
    }
    public onPostSolve(): void {
        const preVelocityMag: number = this.rigidbody.linearVelocity.mag();
        let needChange: boolean = false;
        let finalLinearVelocityX: number = this.rigidbody.linearVelocity.x;
        let finalLinearVelocityY: number = this.rigidbody.linearVelocity.y;

        if (preVelocityMag < 880 || preVelocityMag > 910) {
            needChange = true;
            // 总速度小矫正
            const ratio: number = preVelocityMag / 900;
            const beforeVelocity: cc.Vec2 = this.rigidbody.linearVelocity;
            finalLinearVelocityX = beforeVelocity.x / ratio;
            finalLinearVelocityY = beforeVelocity.y / ratio;
        }
        if (finalLinearVelocityY === 0) {
            needChange = true;
            finalLinearVelocityY = -20;
        } else if (Math.abs(finalLinearVelocityY) < 20) {
            needChange = true;
            if (finalLinearVelocityY > 0) {
                finalLinearVelocityY += 20;
            } else {
                finalLinearVelocityY -= 20;
            }
        }
        if (this.node.x === 320 && finalLinearVelocityX === 0) {
            needChange = true;
            finalLinearVelocityX -= 20;
        }
        if (this.node.x === -320 && finalLinearVelocityX === 0) {
            needChange = true;
            finalLinearVelocityX += 20;
        }
        if (needChange) {
            this.rigidbody.linearVelocity = cc.v2(finalLinearVelocityX, finalLinearVelocityY);
        }
    }
}
