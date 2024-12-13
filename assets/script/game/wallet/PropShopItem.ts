import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { Button } from 'cc';
import { BuyGemsConfig } from '../shop/MergeDefine';
import { Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PropShopItem')
export class PropShopItem extends Component {
    @property(Label)
    private gemsNumber: Label = null!;
    @property(Label)
    private dollarAmount: Label = null!;

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

    @property(Sprite)
    private midIcon: Sprite = null!;

    public onItemClicked: (configId: number) => void = null!;
    private config: BuyGemsConfig = null!;

    onLoad() {
        this.btn_buy.node.on(Button.EventType.CLICK, this.buyProps, this);
    }

    public initItem(config: BuyGemsConfig, level: number) {
        this.config = config;
        this.gemsNumber.string = `x${config.gemsNumber}`;
        this.dollarAmount.string = `$${config.dollarAmount}`;


        this.level1.active = level === 1;
        this.level2.active = level === 2;
        this.level3.active = level === 3;
        this.level4.active = level >= 4;

        switch(level){
            case 1:
                this.midIcon.spriteFrame = this.level1.getComponent(Sprite).spriteFrame;
                break;
            case 2: 
                this.midIcon.spriteFrame = this.level2.getComponent(Sprite).spriteFrame;
                break;
            case 3: 
                this.midIcon.spriteFrame = this.level3.getComponent(Sprite).spriteFrame;
                break;
            case 4: 
                this.midIcon.spriteFrame = this.level4.getComponent(Sprite).spriteFrame;
                break;
        }
    }

    private buyProps() {
        if (this.onItemClicked) {
            console.log("configId", this.config.id);    
            this.onItemClicked(this.config.id);
        }
    }
}