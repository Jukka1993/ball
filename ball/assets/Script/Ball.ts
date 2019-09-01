const { ccclass, property } = cc._decorator;

@ccclass
export class Ball extends cc.Component {
    private speedX: number = 10;
    private speedY: number = 5;
    private speed: cc.Vec2 = cc.v2(1, 0);
    private direct: number = 1;
    private lastOther: cc.Collider = null;
    public onLoad(): void {

        // this.node.getComponent(cc.CircleCollider).
    }
    public update(): void {
        this.node.setPosition(this.node.getPosition().add(this.speed));
    }
    public onCollisionEnter(other: cc.Collider, me: cc.Collider): void {
        // this.speed = cc.v2(0, 0);
        // console.log(other, me);
        if (other === this.lastOther) {
            return;
        }
        if (this.lastOther !== null && this.lastOther.node.x === other.node.x && this.lastOther.node.y === other.node.y) {
            return;
        }
        // return;
        this.lastOther = other;

        const meLeft: number = me.world.aabb.x;
        const meRight: number = me.world.aabb.x + me.world.aabb.width;
        const meTop: number = me.world.aabb.y + me.world.aabb.height;
        const meBottom: number = me.world.aabb.y;

        const otherLeft: number = other.world.aabb.x;
        const otherRight: number = other.world.aabb.x + other.world.aabb.width;
        const otherTop: number = other.world.aabb.y + other.world.aabb.height;
        const otherBottom: number = other.world.aabb.y;
        if (meLeft < otherRight && meRight > otherRight && meTop < otherBottom && meBottom > otherTop) {
            // 左边碰到了
            console.log("AAAA");
            this.speedX = 2;
            this.speed = cc.v2(this.speedX, this.speedY);

            return;
        }
        if (meRight > otherLeft && meLeft < otherLeft && meTop < otherBottom && meBottom > otherTop) {
            // 右边碰到了
            console.log("BBBB");

            this.speedX = -2;
            this.speed = cc.v2(this.speedX, this.speedY);

            return;
        }
        if (meTop > otherBottom && meBottom < otherBottom && meLeft > otherRight && meRight < otherLeft) {
            // 顶上碰到了
            console.log("CCCC");

            this.speedY = -1;
            this.speed = cc.v2(this.speedX, this.speedY);

            return;
        }
        if (meBottom < otherTop && meTop > otherTop && meLeft > otherRight && meRight < otherLeft) {
            // 底下碰到了
            console.log("DDDD");

            this.speedY = 1;
            this.speed = cc.v2(this.speedX, this.speedY);

            return;
        }
        // const otherWorldPos: cc.Vec2 = other.node.convertToWorldSpaceAR(cc.v2(0, 0));
        // const meWorldPos: cc.Vec2 = me.node.convertToWorldSpaceAR(cc.v2(0, 0));
        // const deltaX: number = otherWorldPos.x - meWorldPos.x;
        // if (deltaX > 11) {
        //     console.log("AAA");
        //     this.speedX = -10;
        //     this.speed = cc.v2(this.speedX, this.speedY);

        //     return;
        // }
        // if (deltaX < -11) {
        //     console.log("BBB");
        //     this.speedX = 10;
        //     this.speed = cc.v2(this.speedX, this.speedY);

        //     return;
        // }
        // const deltaY: number = otherWorldPos.y - meWorldPos.y;
        // if (deltaY > 11) {
        //     console.log("CCC");
        //     this.speedY = -5;
        //     this.speed = cc.v2(this.speedX, this.speedY);

        //     return;
        // }
        // if (deltaY < -11) {
        //     console.log("DDD");
        //     this.speedY = 5;
        //     this.speed = cc.v2(this.speedX, this.speedY);

        //     return;
        // }
    }
}
