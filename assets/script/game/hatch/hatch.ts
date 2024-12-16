import { _decorator, Component, Node, Animation, Button, Label } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { HatchNetService } from './HatchNet';
import { UICallbacks } from '../../../../extensions/oops-plugin-framework/assets/core/gui/layer/Defines';
import { HatchReward } from './HatchReward';
import { RewardConfig, UserHatchData, UserHatchEvent } from './HatchDefine';
import { ProgressBar } from 'cc';
import { smc } from '../common/SingletonModuleComp';
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
    private _userData: UserHatchData = new UserHatchData();
    private userHatchResult: RewardConfig[] = [];
    private hatchPrice: number;

    onEnable() {
        this.getHatchBaseInfo();
        this.updateDataDisplay();
    }

    start() {
        this.btn_close?.node.on(Button.EventType.CLICK, this.onClose, this);
        this.btn_RewardView?.node.on(Button.EventType.CLICK, () => { oops.gui.open(UIID.EvolveTips) }, this);
        this.btn_HatchOneTime?.node.on(Button.EventType.CLICK, () => { this.userHatch(1) }, this);
        this.btn_HatchTenTimes?.node.on(Button.EventType.CLICK, () => { this.userHatch(10) }, this);
        this.btn_AddGems?.node.on(Button.EventType.CLICK, () => { oops.gui.open(UIID.GemShop) }, this);
    }

    onClose() {
        oops.gui.remove(UIID.Hatch, false)
    }

    /* 获取用户孵化次数 */
    private async getUserHatchNum() {
        const res = await HatchNetService.getHatchBaseInfo();
        if (res && res.hatchNum != null) {
            this._userData.hatchNum = res.hatchNum;
        }
    }

    /* 获取孵化基础数据 */
    private async getHatchBaseInfo() {
        const res = await HatchNetService.getHatchBaseInfo();
        if (res && res.hatchNum != null && res.hatchTotal != null) {
            this._userData.guaranteedNum = res.hatchTotal;
            this._userData.hatchNum = res.hatchNum;
            this.hatchPrice = res.hatchPrice;
            this.progress.progress = this._userData.hatchNum / this._userData.guaranteedNum;
        }
    }

    /* 更新显示 */
    private updateDataDisplay() {
        this.progress.progress = this._userData.hatchNum / this._userData.guaranteedNum;
        this.label_coinNum.string = `${smc.account.AccountModel.CoinData.goldCoin}`;
        this.label_gemsNum.string = `${smc.account.AccountModel.CoinData.gemsCoin}`;
    }

    private async userHatch(num: number) {
        if (smc.account.AccountModel.CoinData.gemsCoin < num * this.hatchPrice) {
            oops.gui.open(UIID.GemShop)
            return
        }

        this.btn_HatchOneTime.interactable = false;
        this.btn_HatchTenTimes.interactable = false;

        // 绑定动画完成事件
        this.anim.on('finished' as any, this.OnAnimFinish, this);
        // 播放抽奖动画:
        this.anim.play();

        // 请求抽奖
        const res = await HatchNetService.requestUserHatch(num);
        if (res && res.userHatch != null) {
            this.userHatchResult = res.userHatch;
        }
    }

    private OnAnimFinish() {
        var uic: UICallbacks = {
            onAdded: (node: Node, params: any) => {
                node.getComponent(HatchReward)?.InitUI(this.userHatchResult);
            },
        };
        let uiArgs: any;
        oops.gui.open(UIID.HatchReward, uiArgs, uic);

        this.btn_HatchOneTime.interactable = true;
        this.btn_HatchTenTimes.interactable = true;

        this.getUserHatchNum();
        this.updateDataDisplay();
    }
}