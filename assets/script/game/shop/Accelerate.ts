import { _decorator, Component, Node, Label, Button, Animation} from 'cc';
import { smc } from '../common/SingletonModuleComp';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { ShopNetService } from './ShopNet';
import { FreePropsData } from './ShopDefine';
import { Sprite } from 'cc';
import { AccountEvent } from '../account/AccountEvent';
import { CountdownTimer } from './CountdownTimer';
import { coinPoolVM } from '../account/viewModel/CoinPoolViewModel';
import { netConfig } from '../../net/custom/NetConfig';
const { ccclass, property } = _decorator;

@ccclass('Accelerate')
export class Accelerate extends Component {
    @property(Label) downTime: Label = null!;
    @property(Label) collectionSpeed: Label = null!;
    @property(Label) speed: Label = null!;
    @property(Label) freeTime: Label = null!;
    @property(Button) btn_close: Button = null!;
    @property(Button) btn_free: Button = null!;
    @property(Button) btn_propShop: Button = null!;
    @property({ type: CountdownTimer }) countdownTimer: CountdownTimer = null;
    @property(Node) speedAnimNode: Node = null!;

    private freePropsData: FreePropsData = null;

    onLoad() {
        this.btn_close.node.on(Button.EventType.CLICK, this.onClose, this);
        this.btn_free.node.on(Button.EventType.CLICK, this.onFree, this);
        this.btn_propShop.node.on(Button.EventType.CLICK, this.onPropShop, this);
        oops.message.on(AccountEvent.PropDataChange, this.initUI, this);
        ShopNetService.getFreePropsData().then((res) => {
            if (res && res.freeProps) {
                this.freePropsData = res.freeProps;
                this.initUI();
            }
        });
    }

    onEnable() {
        this.initUI();
    }

    onDestroy() {
        oops.message.off(AccountEvent.PropDataChange, this.initUI, this);
    }

    private initUI() {
        if (!this.freePropsData) {
            return;
        }
        if (!this.speedAnimNode) {
            console.error("速度动画节点不存在");
            return;
        }
        let remainSec = 0;
        const userPropData = smc.account.AccountModel.propData;
        const propDataRes = smc.account.AccountModel.propData;
        const anim = this.speedAnimNode.getComponent(Animation);
        if (userPropData.propsId > 0) {
            const timestamp = Math.floor((Date.now() + Number(netConfig.timeDifference)) / 1000);
            remainSec = Math.max(userPropData.endAt - timestamp, 0);
            console.log(`当前时间戳:${timestamp} 截止时间: ${userPropData.endAt} 剩余时间:${remainSec}`);
            anim.play();
        }
        this.countdownTimer.setDuration(remainSec);

        this.freeTime.string = `${Math.floor(this.freePropsData.duration/60)}`;
        this.speed.string = `x${userPropData.propMultiplier}`;
        this.collectionSpeed.string = `${coinPoolVM.GoldSpeed.toFixed(1)}/s`;
        this.btn_free.getComponent(Sprite).grayscale = this.freePropsData?.id === 0;
        anim.stop();
    }

    private onClose() {
        oops.gui.remove(UIID.Accelerate, false);
    }

    private onFree() {
        let propId = this.freePropsData?.id ?? 0;
        if (propId > 0) {
            ShopNetService.useProps(this.freePropsData.id).then((res) => {
                if (res && res.props) {
                    this.freePropsData.id = 0;
                }
            });
        }
    }

    private onPropShop() {
        oops.gui.open(UIID.PropShop);
    }
}


