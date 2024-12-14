import { UITransform } from 'cc';
import { Label } from 'cc';
import { instantiate } from 'cc';
import { Prefab } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { HatchNetService } from './HatchNet';
const { ccclass, property } = _decorator;

@ccclass('AnnouncementRoll')
export class AnnouncementRoll extends Component {
    @property(Node)
    private itemContainer: Node = null!;
    @property(Prefab)
    private itemPrefab: Prefab = null!;
    /**创建item的数量*/
    @property({ type: Number })
    private itemNum: number = 10;
    /**item的大小*/
    private itemSize: number = null!;
    /**滚动速度*/
    @property({ type: Number})
    private speed: number = 100;
    private hatchRecords: string[] = [];
    start() {
        this.createItem();
    }

    /**获得数据后开始创建*/
    private async createItem() {
        //获得预制体的高度
        if (!this.itemSize) {
            let pNode = instantiate(this.itemPrefab);
            this.itemSize = pNode.getComponent(UITransform).contentSize.height;
            pNode.destroy();
        }
        const res = await HatchNetService.getHatchBaseInfo();
        if (res && res.hatchRecords != null) {
            this.hatchRecords = res.hatchRecords;
        }
        if(this.hatchRecords.length < this.itemNum){
            this.itemNum = this.hatchRecords.length;
        }
        for (let index = 0; index < this.itemNum; index++) {
            let pNode = instantiate(this.itemPrefab);
            let labelComponent = pNode.getComponent(Label);
            labelComponent.string = this.hatchRecords[index];
            pNode.parent = this.itemContainer;
            pNode.setPosition(0, (-index) * this.itemSize, 0);
        }
    }

    update(dt) {
        if(this.itemSize*this.itemNum>this.itemContainer.getComponent(UITransform).contentSize.height){
            for (let index = 0; index < this.itemContainer.children.length; index++) {
                this.itemContainer.children[index].y -= this.speed * dt;// 向下移动内容节点
                if (this.itemContainer.children[index].y < - this.itemSize*(this.itemNum-1)) {
                    this.itemContainer.children[index].y = this.itemSize;
                }
            }
        }   
    }
}


