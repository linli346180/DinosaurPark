/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-09-06 10:16:57
 */
import { Button, EventTouch, Node, _decorator } from "cc";
import { GuideModelComp } from "../model/GuideModelComp";
import { GuideViewMask } from "./GuideViewMask";
import { GuideViewPrompt } from "./GuideViewPrompt";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { CCComp } from "../../../../extensions/oops-plugin-framework/assets/module/common/CCComp";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { guideConfigs, guideConfigsLength } from "../GuideConfig";
import { smc } from "../../game/common/SingletonModuleComp";

const { ccclass, property } = _decorator;

/** 
 * 新手引导界面管理
 */
@ccclass('GuideViewComp')
@ecs.register('GuideView', false)
export class GuideViewComp extends CCComp {
    /** 引导数据 */
    private model: GuideModelComp = null!;
    /** 引导遮罩 */
    private mask: GuideViewMask = null!;
    /** 引导提示动画 */
    private prompt: GuideViewPrompt = null!;

    private readonly startIndex = 1;    // 引导开始索引

    init(model: GuideModelComp) {
        this.model = model;
        this.prompt.model = this.model;
        this.mask.model = this.model;

        this.model.curStep = this.startIndex;
        this.model.lastStep = guideConfigsLength();
        this.scheduleOnce(() => { 
            this.check(this.model.curStep);
        });
    }

    onLoad() {
        this.prompt = this.node.addComponent(GuideViewPrompt);
        this.mask = this.node.addComponent(GuideViewMask)
    }

    /** 下一个引导 */
    next() {
        this.model.curStep++;
        oops.log.logView(`验证下一个引擎【${this.model.curStep}】`);
        if (this.model.curStep > this.model.lastStep) {
            this.mask.hide();
            this.prompt.hide();
            this.ent.destroy();
            smc.guide.isFinish = true;
            oops.log.logView(`全部结束`);
        }
        else {
            this.check(this.model.curStep);
        }
    }

    /** 验证引导 */
    check(index: number) {
        if (this.model.curStep != index) {
            return;
        }
        // 延时处理是为了避免与cc.Widget组件冲突，引导遮罩出现后，组件位置变了
        this.scheduleOnce(() => {
            let curNode = this.model.curNode;
            if (curNode == null) {
                this.mask.hide();
                this.prompt.hide();
                oops.log.logView(`暂无引导`)
            }
            else {
                this.mask.draw(curNode);
                this.prompt.show(curNode);
                const desc = oops.language.getLangByID(guideConfigs[this.model.curStep]?.prompt);
                this.prompt.showPrompt(desc);

                let event = this.model.curGuideInfo?.gameEvent;
                if (event && event != '') {
                    oops.message.dispatchEvent(event);
                }
                // 引导节点加触摸事件，跳到下一步
                curNode.on(Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
                curNode.on(Node.EventType.TRANSFORM_CHANGED, this.onTransformChanged, this);
            }
        });
    }

    private onTransformChanged() {
        this.refresh();
    }

    private onTouchEnd(event: EventTouch) {
        var targetNode = event.target as Node;
        targetNode.off(Node.EventType.TOUCH_END, this.onTouchEnd, this, true);
        targetNode.off(Node.EventType.TRANSFORM_CHANGED, this.onTransformChanged, this);

        // 是否触发点击事件
        if (guideConfigs[this.model.curStep]?.emitClickEvent) {
            this.emitClickEvent(targetNode, event);
        }
        this.next();
    }

    private emitClickEvent(targetNode: Node, event: EventTouch) {
        var button = targetNode.getComponent(Button);
        if (button) {
            button.clickEvents.forEach(e => {
                e.emit([event]);
            });
        }
    }

    /** 刷新引导位置 */
    refresh() {
        let btn = this.model.guides.get(this.model.curStep)?.node;
        if (btn) {
            this.mask.draw(btn);
            this.prompt.show(btn);
        }
    }

    reset(): void {
        this.model = null!;
        this.mask.destroy();
        this.prompt.destroy();
        this.destroy();
    }
}