import { _decorator, Component, Node } from 'cc';
import { RankGroup } from './RankDefine';
import { Enum } from 'cc';
import { Toggle } from 'cc';
import { Label } from 'cc';
import { Sprite } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
const { ccclass, property } = _decorator;

@ccclass('ListToggle')
export class ListToggle extends Component {
    @property({ type: Enum(RankGroup) })
    ListType: RankGroup = RankGroup.Invite;

    public onToggleSelcted: (type: RankGroup) => void = () => { };

    private toggle: Toggle = null!;
    private UnCheckLabel: Sprite = null!;

    start() {
        this.toggle = this.node.getComponent(Toggle)!;
        this.UnCheckLabel = this.node.getChildByName("Label_UnCheck")?.getComponent(Sprite)!;
        this.toggle?.node.on(Toggle.EventType.TOGGLE, this.onToggle, this);

        if (this.toggle.isChecked)
            this.UnCheckLabel.node.active = false;
    }

    private onToggle(toggle: Toggle) {
        if (toggle.isChecked) {
            this.onToggleSelcted(this.ListType);
            this.UnCheckLabel.node.active = false;
        } else {
            this.UnCheckLabel.node.active = true;
        }
    }
}


