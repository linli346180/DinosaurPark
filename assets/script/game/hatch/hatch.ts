import { _decorator, Component, Node, Animation, Button, Label } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { HatchNetService } from './HatchNet';
import { UICallbacks } from '../../../../extensions/oops-plugin-framework/assets/core/gui/layer/Defines';
import { HatchReward } from './HatchReward';
import { HatchResult, UserHatchConfig } from './HatchDefine';
import { ProgressBar } from 'cc';
import { smc } from '../common/SingletonModuleComp';
import { tween } from 'cc';
import { HatchRoll } from './HatchRoll';
import { EvolveTipsView } from '../evolve/EvolveTipsView';
const { ccclass, property } = _decorator;

@ccclass('HatchView')
export class HatchView extends Component {
    @property(Button) btn_close: Button = null!;
    @property(Button) btn_RewardView: Button = null!;
    @property(Button) btn_HatchOneTime: Button = null!;
    @property(Button) btn_HatchTenTimes: Button = null!;
    @property(Button) btn_AddGems: Button = null!;
    @property(Label) label_coinNum: Label = null!;
    @property(Label) label_gemsNum: Label = null!;
    @property(ProgressBar) progress: ProgressBar = null!;
    @property(Animation) anim: Animation = null!;
    @property({ type: HatchRoll }) hatchRoll: HatchRoll = null;

    private hatchConfig: UserHatchConfig = new UserHatchConfig();
    private hatchResult: HatchResult = new HatchResult();
    private get canHatch(): boolean {
        const defaultClip = this.anim.defaultClip;
        if (defaultClip) {
            const state = this.anim.getState(defaultClip.name);
            return !state.isPlaying;
        }
        return true;
    }

    onEnable() {
        this.getHatchBaseInfo();
    }

    start() {
        this.btn_close?.node.on(Button.EventType.CLICK, this.onClose, this);
        this.btn_RewardView?.node.on(Button.EventType.CLICK, this.showTips, this);
        this.btn_HatchOneTime?.node.on(Button.EventType.CLICK, () => { this.userHatch(1) }, this);
        this.btn_HatchTenTimes?.node.on(Button.EventType.CLICK, () => { this.userHatch(10) }, this);
        this.btn_AddGems?.node.on(Button.EventType.CLICK, () => { oops.gui.open(UIID.GemShop) }, this);
    }

    onClose() {
        oops.gui.remove(UIID.Hatch, false)
    }

    private showTips() {
        const uic: UICallbacks = {
            onAdded: async (node: Node, params: any) => {
                node.getComponent(EvolveTipsView)?.initUI('incubation');
            }
        };
        const uiArgs: any = {};
        oops.gui.open(UIID.EvolveTips, uiArgs, uic);
    }

    /* 获取孵化基础数据 */
    private async getHatchBaseInfo() {
        const res = await HatchNetService.getHatchBaseInfo();
        if (res && res.hatchInfo != null) {
            this.hatchConfig = res.hatchInfo;
            this.updateDataDisplay();
            this.hatchRoll?.InitUI(this.hatchConfig.hatchRecords);
        }
    }

    /* 更新显示 */
    private updateDataDisplay() {
        this.label_coinNum.string = `${smc.account.AccountModel.CoinData.goldCoin}`;
        this.label_gemsNum.string = `${smc.account.AccountModel.CoinData.gemsCoin}`;
        tween(this.progress).to(0.5, { progress: (this.hatchConfig.hatchNum / this.hatchConfig.hatchTotal) }).start();
    }

    private async userHatch(num: number) {
        if (!this.canHatch) {
            return;
        }

        // 判断宝石是否足够
        if (smc.account.AccountModel.CoinData.gemsCoin < num * this.hatchConfig.hatchPrice) {
            oops.gui.open(UIID.GemShop)
            return
        }

        this.anim.once(Animation.EventType.FINISHED, this.OnAnimFinish, this);
        this.anim.play();
        this.hatchResult = null;
        const res = await HatchNetService.requestUserHatch(num);
        if (res && res.userHatch != null) {
            this.hatchConfig.hatchNum = res.hatchNum;
            this.hatchResult = new HatchResult();
            this.hatchResult.rewardList = res.userHatch;
            this.claimAward();
        }
    }

    private OnAnimFinish() {
        if (this.hatchResult == null) {
            return;
        }
        var uic: UICallbacks = {
            onAdded: (node: Node, params: any) => {
                node.getComponent(HatchReward)?.InitUI(this.hatchResult.rewardList);
            },
        };
        let uiArgs: any;
        oops.gui.open(UIID.HatchReward, uiArgs, uic);
        this.updateDataDisplay();
    }

    private claimAward() {
        let rewardType = [1];
        if (this.hatchResult?.rewardList?.length > 0) {
            rewardType = [...new Set([...rewardType, ...this.hatchResult.rewardList.map(reward => reward.rewardType)])];
        }
        smc.account.OnClaimAward(...rewardType);
    }
}