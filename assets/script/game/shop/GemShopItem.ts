import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { Button } from 'cc';
import { BuyGemsConfig } from './MergeDefine';
const { ccclass, property } = _decorator;

@ccclass('GemShopItem')
export class GemShopItem extends Component {
    @property(Label)
    private gemsNumber: Label = null!;
    @property(Label)
    private dollarAmount: Label = null!;
    @property(Label)
    private rebate: Label = null!;
    @property(Label)
    private tip: Label = null!;

    @property(Button)
    private btn_buy: Button = null!;
    @property({ type: Node })
    private level1: Node = null!;
    @property({ type: Node })
    private level2: Node = null!;
    @property({ type: Node })
    private level3: Node = null!;
    @property({ type: Node })
    private level4: Node = null!;
    @property({ type: Node })
    private attributeNode: Node = null!;

    public onItemClicked: (configId: number) => void = null!;
    private config: BuyGemsConfig = null!;

    onLoad() {
        this.btn_buy.node.on(Button.EventType.CLICK, this.buyGems, this);
    }

    public initItem(config: BuyGemsConfig, level: number) {
        this.config = config;
        this.gemsNumber.string = `x${config.gemsNumber}`;
        this.dollarAmount.string = `$${config.dollarAmount}`;
        this.rebate.string = `${config.rebate}`;
        this.tip.string = `+${Math.floor(config.rebate * config.gemsNumber/100)}`

        this.level1.active = level === 1;
        this.level2.active = level === 2;
        this.level3.active = level === 3;
        this.level4.active = level >= 4;

        this.attributeNode.active = config.firstCharge;
    }

    private buyGems() {
        if (this.onItemClicked) {
            console.log("configId", this.config.id);    
            this.onItemClicked(this.config.id);
        }
    }
}