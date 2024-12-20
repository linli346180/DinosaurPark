
import { _decorator, Component, Node, Prefab, instantiate, UITransform, Label, Vec3, CCInteger } from 'cc';
import { RewardItem } from './RewardItem';
import { TableItemConfig } from '../common/table/TableItemConfig';
import { StringUtil } from '../common/utils/StringUtil';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { hatchRecord } from './HatchDefine';
const { ccclass, property } = _decorator;

@ccclass('HatchRoll')
export class HatchRoll extends Component {
    @property(Prefab) itemPrefab: Prefab = null!;
    @property(Node) itemContainer: Node = null!;
    @property({ type: CCInteger }) speed: number = 20;

    private itemNum: number = 0;
    private itemSize: number = 0;
    private hatchRecords: hatchRecord[] = [];

    private itemConfig: TableItemConfig = new TableItemConfig();

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
    InitUI(records: hatchRecord[]) {
        this.hatchRecords = records;
        this.itemNum = this.hatchRecords.length
        this.populateItems();
        
    }

    private getFormattedName(taret:Label, record: hatchRecord) {
        const itemId = StringUtil.combineNumbers(record.rewardType, record.rewardId, 2);
        try {
            this.itemConfig.init(itemId);
            const nameParts = this.itemConfig.name.split("|");
            const baseName = oops.language.getLangByID(nameParts[0]);
            const propName = nameParts.length > 1 ? `${baseName}${nameParts[1]}` : baseName;

            // 玩家 通过扭蛋获得了 道具名称
            taret.string  = `${record.userName} ${oops.language.getLangByID('hatch_06')} ${propName}`;

        } catch (error) {
            console.error('奖励配置错误', record);
        }
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

    private createItemNode(record: hatchRecord): Node {
        const pNode = instantiate(this.itemPrefab);
        const labelComponent = pNode.getComponent(Label);
        this.getFormattedName(labelComponent, record);
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