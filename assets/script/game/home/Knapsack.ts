import { _decorator, Component, Node, Animation, Button } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { AccountEvent } from '../account/AccountEvent';
const { ccclass, property } = _decorator;

@ccclass('KnapsackView')
export class KnapsackView extends Component {
    @property(Animation) subBtnsAnim: Animation = null!;
    @property(Button) btn_expand: Button = null!;
    @property(Button) btn_fold: Button = null!;

    /** 是否展开 */
    get IsShow() {
        return this.btn_fold.node.active;
    }
    set IsShow(value: boolean) {
        if (this.IsShow === value) return;
        if (value) {
            this.showSubBtns();
        } else {
            this.hideSubBtns();
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

    private hideSubBtns() {
        this.subBtnsAnim.play('sub_fold');
        this.btn_fold.interactable = false;
        this.subBtnsAnim.once(Animation.EventType.FINISHED, () => {
            this.btn_expand.node.active = true;
            this.btn_fold.node.active = false;
            this.btn_fold.interactable = true;
        });
    }

    private showSubBtns() {
        this.subBtnsAnim.play('sub_pop');
        this.btn_expand.interactable = false;
        this.subBtnsAnim.once(Animation.EventType.FINISHED, () => {
            this.btn_expand.node.active = false;
            this.btn_fold.node.active = true;
            this.btn_expand.interactable = true;
        });
    }
}