import { _decorator, Component, Node, Button, Prefab, Sprite, Texture2D, ImageAsset, SpriteFrame, instantiate, Label } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { InviteNetService } from './InviteNet';
import { InviteRewardItem } from './InviteRewardItem';
import { InviteData, InviteRewardConfig } from './InviteData';
import { StringUtil } from '../common/utils/StringUtil';
import { CusScrollList } from '../common/scrollList/CusScrollList';
import { AccountNetService } from '../account/AccountNet';

const { ccclass, property } = _decorator;

/** 邀请界面 */
@ccclass('InviteVeiw')
export class InviteVeiw extends Component {
    @property(Button) btn_close: Button = null!;
    @property(Button) btn_invite: Button = null!;
    @property(Button) btn_copy: Button = null!;
    @property(Node) inviteContent: Node = null!;
    @property(Node) nofriend: Node = null!;
    @property(Node) rewardContainer: Node = null!;
    @property(Prefab) rewardItem: Prefab = null!;
    @property(Label) inviteNum: Label = null!;
    @property(Label) step1: Label = null!;
    @property(Label) step2: Label = null!;
    @property(Label) step3: Label = null!;
    @property({ type: CusScrollList }) scrollList: CusScrollList;
    private inviteLink: string = "";

    onLoad() {
        this.btn_close?.node.on(Button.EventType.CLICK, this.onClose, this);
        this.btn_invite?.node.on(Button.EventType.CLICK, this.openInviteLink, this);
        this.btn_copy?.node.on(Button.EventType.CLICK, this.copyInviteLink, this);
        this.getCopyLink();
        this.initStep();
    }

    onEnable() {
        this.initRewardList();
        this.initInviteList();
    }

    onClose() {
        oops.gui.remove(UIID.Invite, false);
    }

    private async getCopyLink() {
        const res = await InviteNetService.getCopyLink();
        if (res?.copyInviteLinkReturn?.inviteLink) {
            this.inviteLink = res.copyInviteLinkReturn.inviteLink;
        }
    }

    private initStep() {
        this.loadStepDescription('inviteFirst', this.step1);
        this.loadStepDescription('inviteSecond', this.step2);
        this.loadStepDescription('inviteThird', this.step3);
    }

    private async loadStepDescription(key: string, label: Label) {
        const res = await AccountNetService.getLanguageConfig(key);
        if (res?.languageConfigArr?.length > 0) {
            label.string = res.languageConfigArr[0].description;
        }
    }

    /** 初始化奖励列表 */
    private async initRewardList() {
        this.rewardContainer.removeAllChildren();
        const res = await InviteNetService.getInviteReward();
        if (res && res.inviteInfo) {
            const inviteInfo = res.inviteInfo;
            let rewardConfig = new InviteRewardConfig();
            rewardConfig.inveteNum = inviteInfo.inviteNum;
            this.inviteNum.string = `${rewardConfig.inveteNum}`;

            for (const item of inviteInfo.getInviteTaskList) {
                rewardConfig.rewards.push({
                    id: item.inviteCompleteId,
                    clamed: !item.state,
                    inviteNum: item.requiredNum,
                    awardNum: item.rewards[0]?.awardQuantity,
                    awardType: StringUtil.combineNumbers(item.rewards[0]?.awardType, item.rewards[0]?.awardResourceId, 2)
                });
            }
            rewardConfig.rewards.sort((a, b) => a.inviteNum - b.inviteNum);
            for (const item of rewardConfig.rewards) {
                const itemNode = instantiate(this.rewardItem);
                if (itemNode) {
                    itemNode.setParent(this.rewardContainer);
                    itemNode.getComponent(InviteRewardItem)?.initItem(rewardConfig.inveteNum, item);
                }
            }
        }
    }

    /** 初始化邀请列表 */
    private async initInviteList() {
        this.inviteContent.removeAllChildren();
        const res = await InviteNetService.getInviteList();
        if (res && res.inviteList != null) {
            this.nofriend.active = res.inviteList.length == 0;
            let inviteList: InviteData[] = res.inviteList;
            this.scrollList.setDataList(inviteList, 2, [10, 10, 10]);
        }
    }

    private openInviteLink() {
        const url = `https://t.me/share/url?url=${this.inviteLink}`;
        window.open(url);
    }

    private copyInviteLink() {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(this.inviteLink).then(() => {
                oops.gui.toast("invite_10", true);
            }).catch(err => {
                console.error("无法拷贝到剪切板", err);
            });
        } else {
            console.error("当前浏览器不支持 Clipboard API");
        }
    }
}