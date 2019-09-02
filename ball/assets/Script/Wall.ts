const { ccclass, property } = cc._decorator;

@ccclass
export class Wall extends cc.Component {
    @property
    public isOutWall: boolean = false;
    public mChildrens: cc.Node[] = [];
    public mInitChildrenLength:number = 0;
    public disposed:boolean = false;
    public onLoad(): void {
        this.init();
    }
    public init():void{
        if (this.isOutWall) {
            return;
        }
        this.getComponent(cc.Layout).enabled = false;
        this.mInitChildrenLength = this.node.children.length;
        for (let i: number = 0; i < this.mInitChildrenLength; i++) {
            this.mChildrens.push(this.node.children[i]);
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
        } else if (index >= this.mChildrens.length) {
            index = this.mChildrens.length - 1;
        }
        if (this.mChildrens[index] !== null && this.mChildrens[index] !== undefined && this.mChildrens[index].isValid === true) {
            this.mChildrens[index].emit("kick");
        }
    }
    public dispose():void{
        if(this.disposed){
            return;
        }
        this.disposed = true;
        let group:{nod:cc.Node,sourceIndex:number}[] = [];
        const groupGroup:{nod:cc.Node,sourceIndex:number}[][] = [];
        for(let i:number = 0;i< this.mInitChildrenLength;i++){
            if(this.mChildrens[i] !== null && this.mChildrens[i] !== undefined && this.mChildrens[i].isValid === true && cc.isValid(this.mChildrens[i])){
                group.push({nod:this.mChildrens[i],sourceIndex:i});
            } else{
                if(group.length > 0){
                    groupGroup.push(group);
                    group = [];
                }
            }
        }
        if(group.length>0){
            groupGroup.push(group);
        }
        for(let i:number = 0;i< groupGroup.length;i++){
            const template1 = cc.find("wallTemplate");
            const template = cc.instantiate(template1);
            template.setParent(cc.find("Canvas/walls"));
            for(let j:number = 0;j<groupGroup[i].length;j++){
                if(j === 0){
                    template.setPosition(
                        cc.v2(
                            groupGroup[i][j].nod.getPosition().x + groupGroup[i][j].nod.parent.getPosition().x,
                            groupGroup[i][j].nod.getPosition().y + groupGroup[i][j].nod.parent.getPosition().y)
                        )
                }
                groupGroup[i][j].nod.setParent(template);
                groupGroup[i][j].nod.setPosition(cc.v2(j* 30,0));
            }
            template.width = groupGroup[i].length * 30;
            template.getComponent(cc.PhysicsBoxCollider).size = cc.size(template.width,30);
            template.getComponent(cc.PhysicsBoxCollider).offset = cc.v2(template.width/2,0);
            template.active = true;
        }
        this.node.destroy();
    }
}
