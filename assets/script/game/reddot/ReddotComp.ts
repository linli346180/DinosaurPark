import { Vec3 } from 'cc';
import { tween } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { RedDotCmd } from './ReddotDefine';
import { Enum } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { AccountEvent } from '../account/AccountEvent';
const { ccclass, property } = _decorator;

const RedDotCmdEnum = Enum({
    默认: RedDotCmd.default, // 默认
    用户中心: RedDotCmd.userCenter, // 用户中心
    商店: RedDotCmd.userShop, // 商店
    孵蛋: RedDotCmd.UserHatchType, // 孵蛋
    邀请: RedDotCmd.InvitedType, // 邀请
    复活: RedDotCmd.UserDebrisType, // 复活
    邮箱: RedDotCmd.UserEmailType, // 邮箱
    任务: RedDotCmd.UserTaskType, // 任务
    排行: RedDotCmd.RankingType, // 排行
    提现: RedDotCmd.WithDrawalType, // 提现
    星兽图鉴: RedDotCmd.StbBookType, // 星兽图鉴
    星兽活动: RedDotCmd.USDTActivity, // 星兽活动

    黄金1级: 1001, 
    黄金2级: 1002, 
    黄金3级: 1003, 
    黄金4级: 1004,
    黄金5级: 1005,
    黄金6级: 1006,
    黄金7级: 1007, 
    黄金8级: 1008,
    黄金9级: 1009,
    黄金10级: 1010,
    初级至尊星兽: 1011,
    中级至尊星兽: 1012, 
    高级至尊星兽: 1013,
    宝石星兽: 1014,
    砖石星兽: 1015,

    进化说明: 1016,
});

@ccclass('ReddotComp')
export class ReddotComp extends Component {
    @property({ type: RedDotCmdEnum })
    cmd: RedDotCmd = RedDotCmd.default;

    onLoad() {
        const isRead = oops.storage.getBoolean(this.cmd.toString());
        this.node.active = !isRead;
        oops.message.on(AccountEvent.RedDotCmd, this.onHandler, this);
        this.playScaleAnimation(this.node);
    }

    /** 设置为已读状态 */
    public setRead(remove: boolean = true) {
        if(remove) oops.storage.set(this.cmd.toString(), true);
        this.node.active = false;
    }

    onDestroy() {
        oops.message.off(AccountEvent.RedDotCmd, this.onHandler, this);
    }

    private onHandler(event: string, args: any) {
        if (args == this.cmd) {
            this.node.active = true;
        }
    }

    // 缩放动画
    playScaleAnimation(targetNode: Node) {
        const initialScale = Vec3.ONE;
        const targetScale = new Vec3(1.2, 1.2, 1.2);
        tween(targetNode)
            .to(0.5, { scale: targetScale })
            .to(0.5, { scale: initialScale })
            .delay(2)
            .union()
            .repeatForever()
            .start();
    }
}