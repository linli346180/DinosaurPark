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

    start() {
        this.initUI();
        this.accelerate_btn.node.on(Button.EventType.CLICK, this.onAccelerate, this);
        oops.message.on(AccountEvent.AddInComeSTB, this.onHandler, this);
        oops.message.on(AccountEvent.DelIncomeSTB, this.onHandler, this);
        oops.message.on(AccountEvent.PropDataChange, this.onHandler, this);
    }

    onDestroy() {
        oops.message.off(AccountEvent.AddInComeSTB, this.onHandler, this);
        oops.message.off(AccountEvent.DelIncomeSTB, this.onHandler, this);
        oops.message.off(AccountEvent.PropDataChange, this.onHandler, this);
    }

    onHandler(event: string, args: any) {
        switch (event) {
            case AccountEvent.AddInComeSTB:
            case AccountEvent.DelIncomeSTB:
            case AccountEvent.PropDataChange:
                this.initUI();
                break;
        }
    }

    initUI() {
        // 星兽数量
        const stbNum = smc.account.getSTBDataByConfigType(STBConfigType.STB_Gold_Level10).length;
        this.gold_num.string = `(${coinPoolVM.GoldInComeNum}/${stbNum})`;

        // 星兽收益速度
        this.gold_speed.string = `${coinPoolVM.GoldSpeed.toFixed(1)}/s`;
        this.accelerate_num.string = `x${smc.account.AccountModel.propData.propMultiplier}`;
    }

    onAccelerate() {
        oops.gui.open(UIID.Accelerate);
    }
}