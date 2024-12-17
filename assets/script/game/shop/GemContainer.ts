import { Label } from 'cc';
import { Button } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { smc } from '../common/SingletonModuleComp';
import { AccountEvent } from '../account/AccountEvent';
const { ccclass, property } = _decorator;

@ccclass('GemContainer')
export class GemContainer extends Component {
    @property(Label) gemNum: Label = null!;
    @property(Button) btn_addGems: Button = null!;

    onLoad() {
        this.btn_addGems?.node.on(Button.EventType.CLICK, this.onGemShow, this);
        oops.message.on(AccountEvent.CoinDataChange, this.updateUI, this);
    }

    onDestroy() {
        oops.message.off(AccountEvent.CoinDataChange, this.updateUI, this);
    }

    onEnable() {
        this.updateUI();
    }

    onGemShow() {
        oops.gui.open(UIID.GemShop);
    }

    updateUI() {
        this.gemNum.string = Math.floor(smc.account.AccountModel.CoinData.gemsCoin).toString();
    }
}


