import { _decorator, Component, Node, Toggle, Enum } from 'cc';
import { CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TaskToggle')
export class TaskToggle extends Component {
    @property({ type: CCInteger }) index: number = 0;
    @property(Toggle) toggle: Toggle = null!;
    @property(Node) unCheckNode: Node = null!;
    public onToggleSelected: (index: number) => void = () => { };

    start() {
        this.toggle.node.on(Toggle.EventType.TOGGLE, this.onToggle, this);
        this.unCheckNode.active = !this.toggle.isChecked;
    }

    public setChecked(isChecked: boolean) {
        this.toggle.isChecked = isChecked;
        this.unCheckNode.active = !isChecked;
    }

    private onToggle(toggle: Toggle) {
        if (toggle.isChecked && this.onToggleSelected) {
            this.onToggleSelected(this.index);
        }
        this.unCheckNode.active = !toggle.isChecked;
    }
}