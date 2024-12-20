import { _decorator, Component, Node, Label, Sprite, Button, math, SpriteFrame } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { IsPur, PurConCoin, StbKinds, UserInstbConfigData } from '../account/model/STBConfigModeComp';
import { resLoader } from '../../../../extensions/oops-plugin-framework/assets/core/common/loader/ResLoader';
import { smc } from '../common/SingletonModuleComp';
import { AccountEvent } from '../account/AccountEvent';
const { ccclass, property } = _decorator;

@ccclass('AdoptionView')
export class AdoptionView extends Component {
    @property(Button) btn_adopt_one: Button = null!;
    @property(Button) btn_left: Button = null!;
    @property(Button) btn_right: Button = null!;
    @property(Label) price: Label = null!;
    @property(Sprite) beast: Sprite = null!;
    @property(Label) level: Label = null!;
    @property(Node) icon_gold: Node = null!;
    @property(Node) icon_gem: Node = null!;

    private _index: number = 0;
    private _configDataList: UserInstbConfigData[] = [];
    private _spriteFrames: SpriteFrame[] = [];
    private _canClick: boolean = true;

    start() {
        // this.setupButtonHandlers();
        this.loadConfigData();
        this.loadSpriteFrames();
        oops.message.on(AccountEvent.CoinExtraPrizeChange, this.CoinExtraPrizeChange, this);
    }

    CoinExtraPrizeChange() {
        this.loadConfigData();
        this.loadSpriteFrames();
    }

    private setupButtonHandlers() {
        this.btn_adopt_one.node.on(Button.EventType.CLICK, this.adoptStartBeast, this);
        this.btn_left.node.on(Button.EventType.CLICK, this.onLeft, this);
        this.btn_right.node.on(Button.EventType.CLICK, this.onRight, this);
    }

    private loadConfigData() {
        this.getSTBConfig_PurGold();
        // this._index = oops.storage.getNumber("STBConfigIndex", 0);
    }

    private loadSpriteFrames() {
        resLoader.loadDir("bundle", "gui/game/texture/adoption/", SpriteFrame, (err: any, assets: any) => {
            this._spriteFrames = assets.sort((a: any, b: any) => a.name.localeCompare(b.name));
            this.beast.spriteFrame = this._spriteFrames[this._index];
            this.initUI();
        });
    }

    private initUI() {
        this.changeSTBConfig();
    }

    /** 领养星兽(购买) */
    public adoptStartBeast() {
        if (!this._canClick) {
            return;
        }
        oops.message.dispatchEvent(AccountEvent.ShowKnapsackView, true);
        const config = this._configDataList[this._index];
        if (config) {
            console.log(`领养${config.stbName}`);
            this.limitOperateInterval();
            smc.account.adopStartBeastNet(config.id, false, (success: boolean, msg: string) => {});
        }
    }

    // 限制操作间隔时间(0.25s操作一次)
    private limitOperateInterval() {
        this._canClick = false;
        setTimeout(() => {
            this._canClick = true;
        }, 250);
    }

    private onLeft() {
        this._index--;
        this.changeSTBConfig();
    }

    private onRight() {
        this._index++;
        this.changeSTBConfig();
    }

    private changeSTBConfig() {
        this._index = math.clamp(this._index, 0, this._configDataList.length - 1);
        const config = this._configDataList[this._index];
        this.level.string = config.stbGrade.toString();
        this.price.string = config.purConCoinNum.toString();
        if (this._spriteFrames.length > this._index) {
            this.beast.spriteFrame = this._spriteFrames[this._index];
        }
        this.icon_gold.active = config.purConCoin === PurConCoin.gold;
        this.icon_gem.active = config.purConCoin === PurConCoin.gems;
        // oops.storage.set("STBConfigIndex", this._index);
    }

    /** 获取使用金币购买的黄金星兽配置 */
    private getSTBConfig_PurGold() {
        this._configDataList = smc.account.STBConfigMode.instbConfigData.filter(element =>
            element.isPur === IsPur.Yes && element.stbKinds === StbKinds.gold
        ).sort((a, b) => a.stbGrade - b.stbGrade);
    }
}