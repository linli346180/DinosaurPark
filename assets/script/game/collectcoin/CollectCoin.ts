import { Label } from 'cc';
import { Button } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { AccountNetService } from '../account/AccountNet';
import { AccountEvent } from '../account/AccountEvent';
import { smc } from '../common/SingletonModuleComp';
import { AccountCoinType } from '../account/AccountDefine';
import { coinPoolVM } from '../account/viewModel/CoinPoolViewModel';
import { tween } from 'cc';
import { UserInstbConfigData } from '../account/model/STBConfigModeComp';
import { STBTypeID } from '../character/STBDefine';
import { macro } from 'cc';
import { CoinNetService } from '../coin/CoinNet';
import { CoinType } from '../coin/CoinDefine';
import { defaultMaxListeners } from 'events';
const { ccclass, property } = _decorator;

@ccclass('CollectCoin')
export class CollectCoin extends Component {
    @property(Button)
    private btn_close: Button = null!;
    @property(Button)
    private btn_free: Button = null!;
    @property(Button)
    private btn_gem: Button = null!;
    @property(Label)
    private free_coin_num: Label = null!;
    @property(Label)
    private gem_coin_num: Label = null!;
    @property(Label)
    private expend_gem: Label = null!;

    protected onLoad(): void {
        this.loadPayGem();
        this.btn_close.node.on(Button.EventType.CLICK, this.closeScreen, this);
        this.btn_free.node.on(Button.EventType.CLICK, this.freeGetCoin, this);
        this.btn_gem.node.on(Button.EventType.CLICK, this.gemGetCoin, this);
    }

    public Init(goldCoin:number, gemsCoin:number) {
        this.free_coin_num.string = goldCoin.toString();
        this.gem_coin_num.string = gemsCoin.toString();
    }

    private async loadPayGem() {
        const res = await AccountNetService.getCollectCoinData();
        this.expend_gem.string = res.offlineCoinConfig.payGoldCoinNum;
    }

    private closeScreen() {
        oops.gui.remove(UIID.CollectCoin);
    }

    private async freeGetCoin() {
        const res = await AccountNetService.collectCoinPool(2);
        smc.account.AccountModel.CoinData = res.userCoin;
        this.closeScreen();
    }

    private async gemGetCoin() {
        const res = await AccountNetService.collectCoinPool(1);
        smc.account.AccountModel.CoinData = res.userCoin;
        this.closeScreen();
    }
}


