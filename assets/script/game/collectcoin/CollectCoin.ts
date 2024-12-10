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
    @property(Node) goldAnimNode: Node = null!;
    @property(Node) goldAnimBeginFreeNode: Node = null!;
    @property(Node) goldAnimBeginGemsNode: Node = null!;
    @property(Node) goldAnimEndNode: Node = null!;

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
        //this.closeScreen();
    }

    private freeGetCoin() {
        this.collectCoin(CollectCoinType.Free);
        this.showGoldAnim(CollectCoinType.Free);
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
            this.showGoldAnim(CollectCoinType.Gem);
        }

    }

    private showGoldAnim(type: CollectCoinType) {
        this.goldAnimNode.active = true;
        this.goldAnimNode.getComponent(Animation)?.play();
        if(type === CollectCoinType.Free){
            tween(this.goldAnimNode)
                .call(() => {
                    this.goldAnimNode.setWorldPosition(this.goldAnimBeginFreeNode.worldPosition);
                })
                .delay(0.5)
                .to(0.5, { worldPosition: this.goldAnimEndNode.worldPosition })
                .call(() => {
                    this.goldAnimNode.active = false;
                })
                .start();  
        }else if(type === CollectCoinType.Gem){
            tween(this.goldAnimNode)
                .call(() => {
                    this.goldAnimNode.setWorldPosition(this.goldAnimBeginGemsNode.worldPosition);
                })
                .delay(0.5)
                .to(0.5, { worldPosition: this.goldAnimEndNode.worldPosition })
                .call(() => {
                    this.goldAnimNode.active = false;
                })
                .start();
        }  
        // 1秒后执行关闭屏幕的方法
        setTimeout(() => {
            this.closeScreen();
        }, 1000); // 1000毫秒等于1秒
    }
}