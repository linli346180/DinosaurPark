import { _decorator, Component, Node, Button, Prefab, instantiate } from 'cc';
import { GuideRewardInfo } from './GuideDefine';
import { GuideRewardItem } from './GuideRewardItem';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
const { ccclass, property } = _decorator;

@ccclass('GuideReward')
export class GuideReward extends Component {
    @property(Button) btnSure: Button = null!;
    @property(Node) itemContainer: Node = null!;
    @property(Prefab) itemPrefab: Prefab = null!;

    onLoad() {
        this.btnSure.node.on(Button.EventType.CLICK, this.onClose, this);
    }

    onClose() {
        oops.gui.remove(UIID.GuideReward, true);
    }

    initUI(rewards: GuideRewardInfo[]) {
        console.log("初始化奖励UI:", rewards);
        this.itemContainer.removeAllChildren();
        if (rewards){
            rewards.forEach(reward => this.createItem(reward));
        }
    }

    private createItem(reward: GuideRewardInfo) {
        const itemNode = instantiate(this.itemPrefab);
        if (itemNode) {
            this.itemContainer.addChild(itemNode);
            itemNode.getComponent(GuideRewardItem)?.initItem(reward);
        }
    }
}