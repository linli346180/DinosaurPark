import { Label, Button, _decorator, Component, Node, Animation } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { AccountNetService } from '../account/AccountNet';
import { smc } from '../common/SingletonModuleComp';
import { AccountEvent } from '../account/AccountEvent';
import { GemShop } from '../wallet/GemShop';
import { UICallbacks } from '../../../../extensions/oops-plugin-framework/assets/core/gui/layer/Defines';
import { tween } from 'cc';
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

    private async gemGetCoin() {
        const res = await AccountNetService.getCollectCoinData();
        if(smc.account.AccountModel.CoinData < res.offlineCoinConfig.payGoldCoinNum) {
            // 关闭金币收集界面
            oops.gui.remove(UIID.CollectCoin, false); 
            
            // 定义回调，当宝石商店被移除时重新打开金币收集界面
            var uic: UICallbacks = {
                onRemoved: (node: Node, params: any) => {
                    const comp = node.getComponent(GemShop);
                    if (comp) {
                        oops.gui.open(UIID.CollectCoin);
                    }
                },
            };

            // 打开宝石商店界面并注册回调
            oops.gui.open(UIID.GemShop, null, uic);
        }
        else{
            this.collectCoin(CollectCoinType.Gem);
        }

    }

}