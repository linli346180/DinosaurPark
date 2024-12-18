import { _decorator, Component, Node, Label, Button } from 'cc';
import { smc } from '../common/SingletonModuleComp';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { ShopNetService } from './ShopNet';
import { FreePropsData } from './ShopDefine';
const { ccclass, property } = _decorator;

@ccclass('Accelerate')
export class Accelerate extends Component {
    @property(Label) downTime: Label = null!;
    @property(Label) collectionSpeed: Label = null!;
    @property(Label) speed: Label = null!;
    @property(Button) btn_close: Button = null!;
    @property(Button) btn_free: Button = null!;
    @property(Button) btn_propShop: Button = null!;

    private freePropsData: FreePropsData = null;

    onLoad() {
        ShopNetService.getFreePropsData().then((res) => {
            if(res && res.freeProps) {
                this.freePropsData = res.freeProps;
            }
        });
    }

    start() {
        this.btn_close.node.on(Button.EventType.CLICK, this.onClose, this);
        this.btn_free.node.on(Button.EventType.CLICK, this.onFree, this);
        this.btn_propShop.node.on(Button.EventType.CLICK, this.onPropShop, this);
    }

    onEnable() {
        this.initUI();
    }

    private initUI() {
        this.downTime.string = '00:00:00';
        this.collectionSpeed.string = '0/s';
        this.speed.string = 'x1';
    }

    private onClose() {
        oops.gui.remove(UIID.Accelerate);
    }

    private onGemShop() {
        oops.gui.open(UIID.GemShop);
        this.onClose();
    }

    private onFree() {
        this.onClose();
    }

    private onPropShop() {
        oops.gui.open(UIID.PropShop);
        this.onClose();
    }
}


