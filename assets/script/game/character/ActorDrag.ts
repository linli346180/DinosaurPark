import { EventTouch, _decorator, Component, Node, UITransform, Vec3, PhysicsSystem2D } from 'cc';
import { ActorController } from './state/ActorController';
const { ccclass } = _decorator;

@ccclass('ActorDrag')
export class ActorDrag extends Component {
    private actorCtrl: ActorController | null = null!;
    private offset: Vec3 = new Vec3();
    private IsDragging: boolean = false;

    start() {
        // 是否启用物理系统
        PhysicsSystem2D.instance.enable = false;
        this.actorCtrl = this.node.getComponent(ActorController);
        this.node.on(Node.EventType.TOUCH_START, this.onNodeTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onNodeTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onNodeTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onNodeTouchEnd, this);
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.onNodeTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onNodeTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onNodeTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onNodeTouchEnd, this);
    }

    private onNodeTouchStart(event: EventTouch) {
        this.IsDragging = true;
        this.actorCtrl?.setDrag(true);
        this.calculateOffset(event);
        this.setNodeToTop(this.node);

        this.actorCtrl.ShowSurvival = true;
    }

    private onNodeTouchMove(event: EventTouch) {
        if (!this.IsDragging) return;
        this.updateNodePosition(event);
    }

    private onNodeTouchEnd() {
        this.IsDragging = false;
        this.actorCtrl?.setDrag(false);
        setTimeout(()=>{this.actorCtrl.ShowSurvival = false}, 2000);
    }

    private calculateOffset(event: EventTouch) {
        const uiTransform = this.node.parent?.getComponent(UITransform);
        if (uiTransform) {
            const touchLocation = event.getUILocation();
            const worldPosition = new Vec3(touchLocation.x, touchLocation.y, 0);
            const localPosition = uiTransform.convertToNodeSpaceAR(worldPosition);
            this.offset = this.node.position.clone().subtract(localPosition);
        }
    }

    private updateNodePosition(event: EventTouch) {
        if (!this.IsDragging) return;

        const uiTransform = this.node.parent?.getComponent(UITransform);
        if (uiTransform) {
            const touchLocation = event.getUILocation();
            const worldPosition = new Vec3(touchLocation.x, touchLocation.y, 0);
            const localPosition = uiTransform.convertToNodeSpaceAR(worldPosition);
            const newPos = localPosition.add(this.offset);

            // 限制节点移动范围
            if (this.actorCtrl) {
                newPos.x = Math.max(
                    this.actorCtrl.widthLimit.x,
                    Math.min(newPos.x, this.actorCtrl.widthLimit.y)
                );
                newPos.y = Math.max(
                    this.actorCtrl.heightLimit.x,
                    Math.min(newPos.y, this.actorCtrl.heightLimit.y)
                );
            }

            this.node.setPosition(newPos);
        }
    }

    private setNodeToTop(self: Node) {
        if (self.parent) {
            self.setSiblingIndex(self.parent.children.length - 1);
        }
    }
}