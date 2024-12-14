import { _decorator, Component, Node, Label } from 'cc';
import { coinPoolVM } from '../account/viewModel/CoinPoolViewModel';
import { UserInstbConfigData } from '../account/model/STBConfigModeComp';
import { smc } from '../common/SingletonModuleComp';
import { STBConfigType } from '../character/STBDefine';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { AccountEvent } from '../account/AccountEvent';
import { Button } from 'cc';
import { UIID } from '../common/config/GameUIConfig';
const { ccclass, property } = _decorator;

/** 用户收益提示牌 */
@ccclass('UserIncomeView')
export class UserIncomeView extends Component {
    @property(Label) gold_num: Label = null!;
    @property(Label) gold_speed: Label = null!;
    @property(Label) accelerate_num: Label = null!;
    @property(Button) accelerate_btn: Button = null!;

    private readonly maxIncomeNum = 10;     // 最大收益数
    private goldConfig: UserInstbConfigData = null;
    private accelerate: number = 1;

    start() {
        coinPoolVM.Init();
        this.initUI();
        this.accelerate_btn.node.on(Button.EventType.CLICK, this.onAccelerate, this);
        oops.message.on(AccountEvent.AddInComeSTB, this.onHandler, this);
        oops.message.on(AccountEvent.DelIncomeSTB, this.onHandler, this);
    }

    onDestroy() {
        oops.message.off(AccountEvent.AddInComeSTB, this.onHandler, this);
        oops.message.off(AccountEvent.DelIncomeSTB, this.onHandler, this);
    }

    onHandler(event: string, args: any) {
        switch (event) {
            case AccountEvent.AddInComeSTB:
            case AccountEvent.DelIncomeSTB:
                this.initUI();
                break;
        }
    }

    initUI() {
        this.goldConfig = smc.account.getSTBConfigByType(STBConfigType.STB_Gold_Level10);
        const stbNum = smc.account.getUserInstbCount(this.goldConfig.id);
        const incomeNum = Math.min(stbNum, this.maxIncomeNum);
        this.gold_num.string = `{${incomeNum}/${stbNum}}`;

        const goldSpeed = incomeNum * this.goldConfig.incomeNumMin / this.goldConfig.incomeCycle * this.accelerate;
        this.gold_speed.string = `${goldSpeed.toFixed(0)}/s`;

        this.accelerate_num.string = `x${this.accelerate}`;
    }

    onAccelerate() {
        oops.gui.open(UIID.Accelerate);
    }
}