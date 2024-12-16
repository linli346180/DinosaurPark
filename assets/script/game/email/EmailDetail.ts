import { _decorator, Component, Node, Button, Prefab, Label, instantiate } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { EmailNetService } from './EmailNet';
import { EmailRewardItem } from './EmailRewardItem';
import { EmailEvent, EmailReadState, EmailRewardState, MailRecord } from './EmailDefine';
import { tween } from 'cc';
import { v3 } from 'cc';
import { Vec3 } from 'cc';
import { smc } from '../common/SingletonModuleComp';
const { ccclass, property } = _decorator;

@ccclass('EmailDetail')
export class EmailDetail extends Component {
    @property(Button)
    btn_close: Button = null!;
    @property(Prefab)
    rewardItem: Prefab = null!;
    @property(Button)
    btn_unclaimed: Button = null!;
    @property(Button)
    btn_claimed: Button = null!;
    @property(Node)
    rewardContainer: Node = null!;
    @property(Label)
    mailTitle: Label = null!;
    @property(Label)
    mailContent: Label = null!;
    @property(Label)
    expireTime: Label = null!;

    private mailRecord: MailRecord = null!;

    start() {
        this.btn_close?.node.on(Button.EventType.CLICK, this.closeUI, this);
        this.btn_unclaimed?.node.on(Button.EventType.CLICK, this.onClaimed, this);
    }

    closeUI() {
        oops.gui.remove(UIID.EmailDetail);
    }

    initUI(mailRecord: MailRecord) {
        console.log("邮件明细:", mailRecord);

        this.mailRecord = mailRecord;
        if (this.mailRecord.readState == EmailReadState.unread) {
            EmailNetService.readEmail(this.mailRecord.mailRecordId);
        }
        // 设置奖励领取状态
        this.btn_unclaimed.node.active = this.mailRecord.awardState == EmailRewardState.unreceived;
        this.btn_claimed.node.active = this.mailRecord.awardState == EmailRewardState.received;

        this.mailTitle.string = this.mailRecord.mailTitle;
        this.mailContent.string = this.mailRecord.mailContent;
        this.expireTime.string = `${oops.language.getLangByID("common_validity")}:${this.formatExpireTime(this.mailRecord.expireTime)}`;

        // 设置奖励列表
        this.rewardContainer.removeAllChildren();
        if (this.mailRecord.rewards != null && this.mailRecord.rewards.length > 0) {
            this.mailRecord.rewards.forEach((reward) => {
                let rewardItem = instantiate(this.rewardItem);
                if (rewardItem) {
                    rewardItem.parent = this.rewardContainer;
                    rewardItem.getComponent(EmailRewardItem)?.initItem(reward);
                }
            });
        }
    }

    private async onClaimed() {
        this.btn_unclaimed.interactable = false;
        const response = await EmailNetService.clampEmail(this.mailRecord.mailRecordId, this.mailRecord.mailConfigId);
        if (response) {
            this.mailRecord.awardState = EmailRewardState.received;
            this.initUI(this.mailRecord);
            oops.message.dispatchEvent(EmailEvent.receiveEmailReward, this.mailRecord.mailRecordId);

            // 更新用户资产
            let rewardType: number[] = [];
            if (this.mailRecord.rewards != null && this.mailRecord.rewards.length > 0) {
                for (const reward of this.mailRecord.rewards) {
                    if (!rewardType.includes(reward.awardType))
                        rewardType.push(reward.awardType);
                }
            }
            smc.account.OnClaimAward(...rewardType);
        }
        this.btn_unclaimed.interactable = true;
    }

    private formatExpireTime(expireTime: number): string {
        const days = Math.floor(expireTime / (24 * 60 * 60));
        const hours = Math.floor((expireTime % (24 * 60 * 60)) / (60 * 60));
        const dayDesc = oops.language.getLangByID("common_day");
        const hourDesc = oops.language.getLangByID("common_hour");
        return `${days}${dayDesc}${hours}${hourDesc}`;
    }
}