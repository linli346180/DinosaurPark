import { _decorator, Component, Node, Label, Button } from 'cc';
import { CoinType, HatchPriceConfig, UserHatchEvent } from './HatchDefine';
import { HatchNetService } from './HatchNet';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { NetErrorCode } from '../../net/custom/NetErrorCode';
import { smc } from '../common/SingletonModuleComp';
import { UIID } from '../common/config/GameUIConfig';
const { ccclass, property } = _decorator;

@ccclass('HatchPriceItem')
export class HatchPriceItem extends Component {
    @property(Node)
    private coin_1: Node = null!;
    @property(Node)
    private coin_2: Node = null!;
    @property(Node)
    private coin_3: Node = null!;
    @property(Node)
    private coin_4: Node = null!;
    @property(Label)
    private  hatchNum: Label = null!;
    @property(Label)
    private hatchPrice: Label = null!;
    @property(Button)
    private btn_buy: Button = null!;
    @property(Node)
    private maskNode: Node = null!;
    private _priceData: HatchPriceConfig = new HatchPriceConfig();

    onLoad() {
        this.btn_buy.node.on(Button.EventType.CLICK, this.buyHatchNum, this);
    }

    public async initItem(priceData: HatchPriceConfig) {
        this._priceData = priceData;
        this._priceData.purNum = 0;

        this.hatchNum.string = "x" + priceData.hatchNum.toString();
        this.hatchPrice.string = priceData.purNeedCoinNum.toString();
        this.coin_1.active = priceData.conCoinType === CoinType.Gold;
        this.coin_2.active = priceData.conCoinType === CoinType.Gems;
        this.coin_3.active = priceData.conCoinType === CoinType.StarBeast;
        this.coin_4.active = priceData.conCoinType === CoinType.USDT;
        
        if (this._priceData.limitedNum > 0) {
            const res = await HatchNetService.getHatchPurNum(this._priceData.id);
            if (res &&res.purNum) {
                this._priceData.purNum = res.purNum;
                this.checkLimitedNum();
            }
        }
    }

    private checkLimitedNum() {
        if (this._priceData.limitedNum > 0) {
            console.log(`购买次数:${this._priceData.purNum},限购次数:${this._priceData.limitedNum}`);
            this.maskNode.active = this._priceData.purNum >= this._priceData.limitedNum;
        }
    }

    private async buyHatchNum() {
        if (this._priceData.conCoinType === CoinType.Gems) {
            const letNum = Math.floor(smc.account.AccountModel.CoinData.gemsCoin) - Math.floor(this._priceData.purNeedCoinNum);
            console.log(`剩余宝石数量:${smc.account.AccountModel.CoinData.gemsCoin},所需宝石:${this._priceData.purNeedCoinNum}`);
            if (letNum < 0) {
                oops.gui.toast("tips_gem_noenough", true);
                oops.gui.open(UIID.GemShop);
                oops.gui.remove(UIID.HatchShop, false);
                return;
            }
        }

        this.btn_buy.interactable = false;
        const res = await HatchNetService.requestHatchNum(this._priceData.id);
        if (res && res.resultCode == NetErrorCode.Success) {
            this._priceData.purNum++;
            this.checkLimitedNum(); // 检查限购次数

            smc.account.updateCoinData(); // 刷新金币数量
            oops.message.dispatchEvent(UserHatchEvent.HatchRemailChange, res.userHatch.remainNum);
            oops.gui.toast("tips_buy_sucess", true);
        }
        this.btn_buy.interactable = true;
    }
}