import { Button, Prefab, _decorator, Component, Node, instantiate } from 'cc';
import { RewardConfig } from './HatchDefine';
import { RewardItem } from './RewardItem';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HatchReward')
export class HatchReward extends Component {
    @property(Prefab) itemPrefab: Prefab = null!;
    @property(Prefab) layoutItem: Prefab = null!;
    @property(Button) btn_reward: Button = null!;
    @property(Node) container: Node = null!;
    private rewardData: RewardConfig[] = [];

    start() {
        this.btn_reward.node.on(Button.EventType.CLICK, this.closeUI, this);
    }

    closeUI() {
        oops.gui.remove(UIID.HatchReward, true);
    }

    InitUI(rewardList: RewardConfig[]) {
        this.container.removeAllChildren();
        if (!rewardList || rewardList.length <= 0) {
            console.error("孵蛋奖励不允许为空");
            return;
        }
        // 单个奖励放大
        const scale = rewardList.length == 1 ? new Vec3(Vec3.ONE).multiplyScalar(2) : Vec3.ONE;
        this.rewardData = rewardList;
        const num = Math.ceil(this.rewardData.length / 5.0);
        for (let i = 0; i < num; i++) {
            const layoutNode = instantiate(this.layoutItem);
            if (layoutNode) {
                layoutNode.removeAllChildren();
                this.container.addChild(layoutNode);
            }
        }
        rewardList.forEach((reward, index) => {
            const itemNode = instantiate(this.itemPrefab);
            itemNode.setScale(scale);
            itemNode.parent = this.container.children[Math.floor(index / 5)];
            itemNode.getComponent<RewardItem>(RewardItem)?.initItem(reward);
        });
    }
}