import { Label, Button, _decorator, Component } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { AccountNetService } from '../account/AccountNet';
import { smc } from '../common/SingletonModuleComp';
import { AccountEvent } from '../account/AccountEvent';
const { ccclass, property } = _decorator;

enum CollectCoinType { 
    Free = 2,
    Gem = 1
}

@ccclass('CollectCoin')
export class CollectCoin extends Component {
    @property(Button) btnClose: Button = null!;
    @property(Button) btnFree: Button = null!;
    @property(Button) btnGem: Button = null!;
    @property(Label) freeCoinNum: Label = null!;
    @property(Label) gemCoinNum: Label = null!;
    @property(Label) expendGem: Label = null!;

    protected onLoad(): void {
        this.loadPayGem();
        this.btnClose.node.on(Button.EventType.CLICK, this.closeScreen, this);
        this.btnFree.node.on(Button.EventType.CLICK, this.freeGetCoin, this);
        this.btnGem.node.on(Button.EventType.CLICK, this.gemGetCoin, this);
    }

    public Init(goldCoin: number, gemsCoin: number) {
        this.freeCoinNum.string = goldCoin.toString();
        this.gemCoinNum.string = gemsCoin.toString();
    }

    private async loadPayGem() {
        const res = await AccountNetService.getCollectCoinData();
        if(res && res.offlineCoinConfig) {
            this.expendGem.string = res.offlineCoinConfig.payGoldCoinNum;
        }
    }

    private closeScreen() {
        oops.gui.remove(UIID.CollectCoin);
    }

    private async collectCoin(type: CollectCoinType) {
        const res = await AccountNetService.collectCoinPool(type);
        if(res && res.userCoin) {
            smc.account.AccountModel.CoinData = res.userCoin;
            oops.message.dispatchEvent(AccountEvent.CoinDataChange);
        }
        this.closeScreen();
    }

    private freeGetCoin() {
        this.collectCoin(CollectCoinType.Free);
    }

    private gemGetCoin() {
        this.collectCoin(CollectCoinType.Gem);
    }
}