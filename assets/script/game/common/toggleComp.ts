import { CCInteger } from 'cc';
import { _decorator, Component, Toggle, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('toggleComp')
export class toggleComp extends Component {
    @property({ type: CCInteger })
    index: number = 0;
    @property(Toggle) toggle: Toggle = null!;
    public onToggleSelcted: (index: number) => void = () => { };
    private UnCheckLabel: Label | null;

    onLoad() {
        this.toggle?.node.on(Toggle.EventType.TOGGLE, this.onToggle, this);
        this.UnCheckLabel = this.node.getChildByName("Label_UnCheck")?.getComponent(Label)!;
        if (this.UnCheckLabel && this.toggle.isChecked)
            this.UnCheckLabel.node.active = false;
    }

    public onClick() {
        this.toggle.isChecked = true;
    }

    public setChecked(isChecked: boolean) {
        this.toggle.isChecked = isChecked;
        if (this.UnCheckLabel)
            this.UnCheckLabel.node.active = !isChecked;
    }

    private onToggle(toggle: Toggle) {
        if (toggle.isChecked) {
            if (this.onToggleSelcted)
                this.onToggleSelcted(this.index);

            if (this.UnCheckLabel)
                this.UnCheckLabel.node.active = false;
        } else {
            if (this.UnCheckLabel)
                this.UnCheckLabel.node.active = true;
        }
    }
}


