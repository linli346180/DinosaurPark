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

    private goldConfig: UserInstbConfigData = null;
    private gemConfig: UserInstbConfigData = null;
    
    start() {
        this.loadCoinData();
        this.setupButtonHandlers();
        coinPoolVM.Init();
    }

    private async loadCoinData() {
        this.goldConfig = smc.account.getSTBConfigByType(STBTypeID.STB_Gold_Level10);
        if (this.goldConfig == null) return;
        this.schedule(this.updateGoldPool, this.goldConfig.incomeCycle + 5, macro.REPEAT_FOREVER, this.goldConfig.incomeCycle);
        this.playAnim(this.free_coin_num, coinPoolVM.GoldNum/2);
        this.playAnim(this.gem_coin_num, coinPoolVM.GoldNum);
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
        coinPoolVM.GoldNum = 0;
        // 重启定时器
        this.unschedule(this.updateGoldPool);
        this.schedule(this.updateGoldPool, this.goldConfig.incomeCycle + 5, macro.REPEAT_FOREVER, this.goldConfig.incomeCycle);
    }

    private async gemGetCoin(){
        smc.account.UseCollectCoin(AccountCoinType.Gold);
        console.log("获得宝石金币: ");
        oops.gui.remove(UIID.CollectCoin, true);
        coinPoolVM.GoldNum = 0;
        // 重启定时器
        this.unschedule(this.updateGoldPool);
        this.schedule(this.updateGoldPool, this.goldConfig.incomeCycle + 5, macro.REPEAT_FOREVER, this.goldConfig.incomeCycle);
    }

    //数值超过百万后，需要将单位转换成M
    private dataDisplayConversion(num: number){
        if(num >= 1000000){
            return (num/1000000).toFixed(2) + "M";
        }else{  
            return num.toString();
        }
    }

    /** 更新金币池 */
    private updateGoldPool() {
        coinPoolVM.GoldNum = Number(coinPoolVM.GoldNum) + Number(coinPoolVM.GoldSpeed);
        this.playAnim(this.free_coin_num, coinPoolVM.GoldNum/2);
        this.playAnim(this.gem_coin_num, coinPoolVM.GoldNum);
    }

    private playAnim(label: Label, endNum: number, callback?: Function) {
        let startNum = parseInt(label.string);
        tween(label)
            .to(0.5, {}, {
                onUpdate: (target, ratio) => { label.string = Math.floor(startNum + (endNum - startNum) * ratio).toString(); }
            })
            .call(() => { if (callback) callback(); })
            .start();
    }
}


