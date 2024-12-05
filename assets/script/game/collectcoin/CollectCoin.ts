import { Label } from 'cc';
import { Button } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { AccountNetService } from '../account/AccountNet';
import { AccountEvent } from '../account/AccountEvent';
import { smc } from '../common/SingletonModuleComp';
import { AccountCoinType } from '../account/AccountDefine';
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
    start() {
        this.loadCoinData();
        this.setupButtonHandlers();
    }

    private async loadCoinData() {
        const res = await AccountNetService.UseCollectCoin();
        this.free_coin_num.string = this.dataDisplayConversion(Number(res.userCoin.goldCoin)/2);
        this.gem_coin_num.string = this.dataDisplayConversion(Number(res.userCoin.goldCoin));
        this.expend_gem.string = this.dataDisplayConversion(100);
    }

    private setupButtonHandlers() {
        this.btn_close.node.on(Button.EventType.CLICK, this.closeScreen, this);
        this.btn_free.node.on(Button.EventType.CLICK, this.freeGetCoin, this);
        this.btn_gem.node.on(Button.EventType.CLICK, this.gemGetCoin, this);
    }

    private closeScreen(){
        oops.gui.remove(UIID.CollectCoin, false);
    }

    private async freeGetCoin(){
        smc.account.UseCollectCoin(AccountCoinType.Gold);
        console.log("获得免费金币: ");
        oops.gui.remove(UIID.CollectCoin, true);
    }

    private async gemGetCoin(){
        smc.account.UseCollectCoin(AccountCoinType.Gold);
        console.log("获得宝石金币: ");
        oops.gui.remove(UIID.CollectCoin, true);
    }

    //数值超过百万后，需要将单位转换成M
    private dataDisplayConversion(num: number){
        if(num >= 1000000){
            return (num/1000000).toFixed(2) + "M";
        }else{  
            return num.toString();
        }
    }
}


