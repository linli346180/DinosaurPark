import { _decorator, Component, Node, Animation, Button } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { AccountEvent } from '../account/AccountEvent';
const { ccclass, property } = _decorator;

@ccclass('KnapsackView')
export class KnapsackView extends Component {
    @property(Animation) animation: Animation = null!;
    @property(Button) btn_expand: Button = null!;
    @property(Button) btn_fold: Button = null!;

    /** 是否展开 */
    get IsShow() {
        return this.btn_fold.node.active;
    }
    set IsShow(value: boolean) {
        if (this.IsShow === value) return;
        if (value) {
            this.onKnapsackShow();
        } else {
            this.onKnapsackHide();
        }
    }

    start() {
        oops.message.on(AccountEvent.ShowKnapsackView, this.onHandler, this);
        // this.btn_fold?.node.on(Button.EventType.CLICK, this.hideSubBtns, this);
        // this.btn_expand?.node.on(Button.EventType.CLICK, this.showSubBtns, this);
    }

    onDestroy() {
        oops.message.off(AccountEvent.ShowKnapsackView, this.onHandler, this);
    }

    private onHandler(event: string, args: any) {
        if (event === AccountEvent.ShowKnapsackView) {
            let needShow = true;
            if (args !== null && args !== undefined && typeof args === 'boolean') {
                needShow = args;
            }
            this.IsShow = needShow;
        }
    }

    private onKnapsackHide() {
        this.animation.play('knapsack_hide');
    }

    private onKnapsackShow() {
        this.animation.play('knapsack_open');
    }
}