import { Button, _decorator, Component, Node, sys } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { GuideNetService } from './GuideNet';
import { UserOfficial, PresellInfo, GuideRewardInfo } from './GuideDefine';
import { GameEvent } from '../common/config/GameEvent';
import { UICallbacks } from '../../../../extensions/oops-plugin-framework/assets/core/gui/layer/Defines';
import { GuideReward } from './GuideReward';

const { ccclass, property } = _decorator;

@ccclass('GuideView')
export class GuideView extends Component {
    @property(Button) btnClose: Button = null!;
    @property(Button) btnContinue: Button = null!;
    @property(Button) btnJoinChannel: Button = null!;
    @property(Button) btnJoinGroup: Button = null!;
    @property(Button) btnJoinX: Button = null!;
    private presellInfo = new PresellInfo();

    onLoad(): void {
        this.btnClose.node.on(Button.EventType.CLICK, this.onClose, this);
        this.btnContinue.node.on(Button.EventType.CLICK, this.getUserOfficial, this);
        this.btnJoinChannel.node.on(Button.EventType.CLICK, () => { this.joinChannel(this.presellInfo.officialChannelUrl); }, this);
        this.btnJoinGroup.node.on(Button.EventType.CLICK, () => { this.joinChannel(this.presellInfo.officialGroupUrl); }, this);
        this.btnJoinX.node.on(Button.EventType.CLICK, this.onPresellLeave, this);
        this.getPresellData();
        this.getUserOfficial();
    }

    onClose() {
        oops.gui.remove(UIID.GuideChannel, true);
    }

    private async getPresellData() {
        const res = await GuideNetService.getPresellData();
        if (res && res.presellConfig != null) {
            this.presellInfo = res.presellConfig;
        }
    }

    private async getUserOfficial() {
        this.btnContinue.interactable = false;
        try {
            const data = await GuideNetService.getUserOfficial();
            this.btnContinue.interactable = true;
            if (data) {
                this.updateJoinButtons(data);
                const isJoinChannel = data.joinOfficialChannel === 1 && data.joinOfficialGroup === 1 && data.joinX === 1;
                const isReward = data.scorpionReward === 0;
                console.warn(`是否加入官方频道:${isJoinChannel}, 是否领取新手奖励:${isReward}`);
                if (!isJoinChannel) return;
                if (!isReward) {
                    await GuideNetService.getRewardNew();
                    oops.message.dispatchEvent(GameEvent.GuideFinish);
                    this.openGuideRewardUI(data.rewards);
                } else {
                    this.finishGuide();
                }
            }
        } catch (error) {
            console.error("获取用户官方信息时出错:", error);
            this.btnContinue.interactable = true;
        }
    }

    private updateJoinButtons(data: UserOfficial) {
        this.btnJoinChannel.node.active = !(data.joinOfficialChannel === 1);
        this.btnJoinGroup.node.active = !(data.joinOfficialGroup === 1);
        this.btnJoinX.node.active = !(data.joinX === 1);
    }

    private openGuideRewardUI(rewards: GuideRewardInfo[]) {
        const uic: UICallbacks = {
            onAdded: async (node: Node, params: any) => {
                node.getComponent(GuideReward)?.initUI(rewards);
            },
            onRemoved: (node: Node | null, params: any) => {
                oops.gui.remove(UIID.GuideChannel);
            }
        };
        const uiArgs: any = {};
        oops.gui.open(UIID.GuideReward, uiArgs, uic);
    }

    private finishGuide() {
        oops.gui.remove(UIID.GuideChannel);
        oops.message.dispatchEvent(GameEvent.GuideFinish);
    }

    private joinChannel(url: string) {
        console.log('跳转链接:', url);
        if (sys.platform === sys.Platform.DESKTOP_BROWSER) {
            const telegramWebApp = (window as any).Telegram.WebApp;
            telegramWebApp.openLink(url);
        } else {
            window.open(url);
        }
    }

    private onPresellLeave() {
        GuideNetService.getPresellLeave();
        this.joinChannel(this.presellInfo.xUrl);
    }
}