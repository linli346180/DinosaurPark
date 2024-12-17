
import { _decorator, Component, Node, Prefab, instantiate, UITransform, Label, Vec3, CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HatchRoll')
export class HatchRoll extends Component {
    @property(Prefab) itemPrefab: Prefab = null!;
    @property(Node) itemContainer: Node = null!;
    @property({ type: CCInteger }) speed: number = 20;

    private itemNum: number = 0;
    private itemSize: number = 0;
    private hatchRecords: string[] = [];

    onLoad() {
        this.initializeItemSize();
    }

    // 初始化item的高度
    private initializeItemSize() {
        if (!this.itemSize) {
            const pNode = instantiate(this.itemPrefab);
            this.itemSize = pNode.getComponent(UITransform).contentSize.height;
            pNode.destroy();
        }
    }

    // 初始化UI
    InitUI(records: string[]) {
        this.hatchRecords = records;
        this.itemNum = this.hatchRecords.length
        this.populateItems();
    }

    // 填充item
    private populateItems() {
        this.itemContainer.removeAllChildren();
        for (let index = 0; index < this.itemNum; index++) {
            const pNode = this.createItemNode(this.hatchRecords[index]);
            pNode.setPosition(0, -index * this.itemSize, 0);
            this.itemContainer.addChild(pNode);
        }
    }

    private createItemNode(record: string): Node {
        const pNode = instantiate(this.itemPrefab);
        const labelComponent = pNode.getComponent(Label);
        labelComponent.string = record;
        return pNode;
    }

    update(dt: number) {
        this.updateItemPositions(dt);
    }

    // 更新item坐标
    private updateItemPositions(dt: number) {
        for (const child of this.itemContainer.children) {
            child.setPosition(child.position.x, child.position.y - this.speed * dt, child.position.z);
            if (child.position.y < -this.itemSize * (this.itemNum - 1)) {
                const maxY = Math.max(...this.itemContainer.children.map(c => c.position.y));
                child.setPosition(child.position.x, maxY + this.itemSize, child.position.z);
            }
        }
    }
}