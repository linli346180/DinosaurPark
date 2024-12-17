import { _decorator, Component, Node, Button, Prefab, instantiate, ToggleContainer } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { TaskItem } from './TaskItem';
import { TaskNetService } from './TaskNet';
import { TaskData,  TaskDataList, TaskType } from './TaskDefine';
import { TaskToggle } from './TaskToggle';
const { ccclass, property } = _decorator;

/** 任务 */
@ccclass('TaskView')
export class TaskView extends Component {
    @property(Node) content: Node = null!;
    @property(Prefab) itemPrefab: Node = null!;
    @property(Node) toggleContainer: Node = null!;
    @property(Button) btn_close: Button = null!;
    @property(Node) emptyNode: Node = null!;

    private curTaskType: TaskType = TaskType.daily;
    private taskList: TaskDataList = new TaskDataList();

    onEnable(): void {
        this.getTaskData(this.curTaskType);
    }

    start() {
        this.btn_close?.node.on(Button.EventType.CLICK, this.onClose, this);
        this.toggleContainer.children.forEach((child, index) => {
            const comp = child.getComponent(TaskToggle);
            if (comp) {
                comp.setChecked(comp.index == this.curTaskType);
                comp.onToggleSelected = this.onToggleSelected.bind(this);
            }
        });
    }

    private onClose() {
        oops.gui.remove(UIID.Task, false);
    }

    private onToggleSelected(index: number) {
        this.curTaskType = index;
        this.getTaskData(this.curTaskType);
    }

    private async getTaskData(taskType: TaskType) {
        this.content.removeAllChildren();
        let taskCount = 0;
        const res = await TaskNetService.getTaskData(this.curTaskType);
        if (res && res.taskList != null) {
            this.taskList.fillData(this.curTaskType, res.taskList);
            res.taskList.forEach(taskData => {
                this.createTaskItem(taskData);
                taskCount++;
            });
        }
        this.emptyNode.active = taskCount == 0;
    }

    private createTaskItem(taskData: TaskData) {
        const item = instantiate(this.itemPrefab);
        if (item) {
            item.parent = this.content;
            item.getComponent(TaskItem)?.initItem(taskData);
        }
    }
}