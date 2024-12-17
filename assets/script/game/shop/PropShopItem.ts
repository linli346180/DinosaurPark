import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { Button } from 'cc';
import { BuyGemsConfig } from './MergeDefine';
import { Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PropShopItem')
export class PropShopItem extends Component {
    @property(Label) gemsNumber: Label = null!;
    @property(Label) dollarAmount: Label = null!;
    @property(Button) btn_buy: Button = null!;
    @property(Sprite) propIcon: Sprite = null!;
    @property(Sprite) buyIcon: Sprite = null!;
    @property(Sprite) typeIcon: Sprite = null!;

    public onItemClicked: (configId: number) => void = null!;
    private config: BuyGemsConfig = null!;

    onLoad() {
        this.btn_buy.node.on(Button.EventType.CLICK, this.buyProps, this);
    }

    public initItem(config: BuyGemsConfig, level: number) {
        this.config = config;
        this.gemsNumber.string = `x${config.gemsNumber}`;
        this.dollarAmount.string = `$${config.dollarAmount}`;
    }

    private buyProps() {
        if (this.onItemClicked) {
            console.log("configId", this.config.id);    
            this.onItemClicked(this.config.id);
        }
    }
}