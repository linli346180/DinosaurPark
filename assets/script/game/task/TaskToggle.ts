import { _decorator, Component, Label, Toggle, Enum } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { TaskEvent, TaskType } from './TaskDefine';
import { Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TaskToggle')
export class TaskToggle extends Component {
    @property({ type: Enum(TaskType) })
    taskType: TaskType = TaskType.daily;

    private toggle: Toggle = null!;
    private UnCheckLabel: Sprite = null!;

    start() {
        this.toggle = this.node.getComponent(Toggle)!;
        this.UnCheckLabel = this.node.getChildByName("UnCheckLabel")?.getComponent(Sprite)!;
        this.toggle?.node.on(Toggle.EventType.TOGGLE, this.onToggle, this);

        if (this.toggle.isChecked)
            this.UnCheckLabel.node.active = false;
    }

    private onToggle(toggle: Toggle) {
        if (toggle.isChecked) {
            oops.message.dispatchEvent(TaskEvent.TaskUpdate, this.taskType);
            this.UnCheckLabel.node.active = false;
        } else {
            this.UnCheckLabel.node.active = true;
        }
    }
}