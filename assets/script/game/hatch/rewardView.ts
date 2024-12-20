import { Button } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
const { ccclass, property } = _decorator;

@ccclass('rewardView')
export class rewardView extends Component {
    @property(Button) btn_close: Button = null!;
    start() {
        this.btn_close?.node.on(Button.EventType.CLICK, () => { oops.gui.remove(UIID.RewardView) }, this);
    }
}


