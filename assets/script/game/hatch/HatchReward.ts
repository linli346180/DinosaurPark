import { Button, Prefab, _decorator, Component, Node, instantiate } from 'cc';
import { RewardConfig } from './HatchDefine';
import { RewardItem } from './RewardItem';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { smc } from '../common/SingletonModuleComp';
import { AwardType } from '../account/AccountDefine';
const { ccclass, property } = _decorator;

@ccclass('HatchReward')
export class HatchReward extends Component {
    @property(Prefab) itemPrefab: Prefab = null!;
    @property(Button) btn_reward: Button = null!;
    @property(Node) container: Node = null!;
    @property(Node) layoutItem: Node = null!;
    private rewardData: RewardConfig[] = [];

    start() {
        this.btn_reward.node.on(Button.EventType.CLICK, this.closeUI, this);
    }

    closeUI() {
        oops.gui.remove(UIID.HatchReward, true);
    }

    InitUI(rewardList: RewardConfig[]) {
        this.rewardData = rewardList;
        const num = Math.ceil(this.rewardData.length / 5.0); // 添加节点数量
        this.container.removeAllChildren();
        for (let i = 0; i < num; i++) {
            const layoutNode = instantiate(this.layoutItem);
            this.container.addChild(layoutNode);
        }
        rewardList.forEach((reward, index) => {
            const itemNode = instantiate(this.itemPrefab);
            itemNode.parent = this.container.children[Math.floor(index / 5)];
            itemNode.getComponent<RewardItem>(RewardItem)?.initItem(reward);
        });

        this.onClaim();
    }

    onClaim() {
        let rewardType: number[] = [];
        if (this.rewardData.length > 0) {
            for(const reward of this.rewardData){
                if(!rewardType.includes(reward.rewardType))
                    rewardType.push(reward.rewardType);
            }
        }
        smc.account.OnClaimAward(...rewardType);
    }
}