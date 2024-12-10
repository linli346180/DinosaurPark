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
import { guideConfigs } from "../GuideConfig";

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

    start() {
        this.model = this.ent.get(GuideModelComp);
        this.prompt = this.node.addComponent(GuideViewPrompt);
        this.prompt.model = this.model;
        this.mask = this.node.addComponent(GuideViewMask);
        this.mask.model = this.model;
    }

    /** 注册引导项 */
    register(step: number, Node: Node) {
        this.model.guides.set(step, Node);

        // 配置引导节点
        if(guideConfigs[step])  {
            guideConfigs[step].targetNode = Node;
            console.log(`注册引导节点【${step}】`);
        } else {
            console.error(`注册引导节点【${step}】失败`);
        }
    }

    /** 下一个引导 */
    next() {
        this.model.curStep++;
        oops.log.logView(`验证下一个引擎【${this.model.curStep}】`);

        if (this.model.curStep > this.model.lastStep) {
            this.mask.hide();
            this.prompt.hide();
            this.ent.destroy();
            oops.log.logView(`全部结束`);
        }
        else {
            this.check();
        }
    }

    /** 验证引导 */
    check() {
        // 延时处理是为了避免与cc.Widget组件冲突，引导遮罩出现后，组件位置变了
        this.scheduleOnce(() => {
            let curNode = this.model.guides.get(this.model.curStep);
            if (curNode == null) {
                this.mask.hide();
                this.prompt.hide();
                oops.log.logView(`暂无引导`)
            }
            else {
                this.mask.draw(curNode);
                this.prompt.show(curNode);
                this.prompt.showPrompt(guideConfigs[this.model.curStep].prompt);

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

        var button = targetNode.getComponent(Button);
        if (button) {
            button.clickEvents.forEach(e => {
                e.emit([event]);
            });
        }

        this.next();
    }

    /** 刷新引导位置 */
    refresh() {
        let btn = this.model.guides.get(this.model.curStep);
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