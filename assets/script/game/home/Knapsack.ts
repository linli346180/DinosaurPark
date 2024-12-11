import { _decorator, Component, Node, Animation, Button } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { AccountEvent } from '../account/AccountEvent';
const { ccclass, property } = _decorator;

@ccclass('KnapsackView')
export class KnapsackView extends Component {
    @property(Animation)
    subBtnsAnim: Animation = null!;
    @property(Button)
    btn_expand: Button = null!;
    @property(Button)
    btn_fold: Button = null!;
    @property(Node)
    knapsackPanel: Node = null!;
    @property(Node)
    KnapsackPanel: Node = null!;

    // start() {
    //     this.btn_fold?.node.on(Button.EventType.CLICK, this.hideSubBtns, this);
    //     this.btn_expand?.node.on(Button.EventType.CLICK, this.showSubBtns, this);
    // }

    hideSubBtns() {
        oops.message.dispatchEvent(AccountEvent.HideUserOperation);
        this.subBtnsAnim.play('sub_fold');
        this.btn_fold.interactable = false;
        this.subBtnsAnim.once(Animation.EventType.FINISHED, () => {
            this.btn_expand.node.active = true;
            this.btn_fold.node.active = false;
            this.btn_fold.interactable = true;
        });
    }

    showSubBtns() {
        oops.message.dispatchEvent(AccountEvent.HideUserOperation);
        this.subBtnsAnim.play('sub_pop');
        this.btn_expand.interactable = false;
        this.subBtnsAnim.once(Animation.EventType.FINISHED, () => {
            this.btn_expand.node.active = false;
            this.btn_fold.node.active = true;
            this.btn_expand.interactable = true;
        });
    }
}