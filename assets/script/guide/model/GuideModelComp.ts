/*
 * @Author: dgflash
 * @Date: 2022-03-21 11:12:03
 * @LastEditors: dgflash
 * @LastEditTime: 2022-09-06 10:12:03
 */
import { Node } from "cc";
import { GuideViewItem } from "../view/GuideViewItem";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { guideConfigs } from "../GuideConfig";

/** 引导数据 */
@ecs.register('GuideModel')
export class GuideModelComp extends ecs.Comp {
    /** 当前引导步骤 */
    curStep: number = -1;
    /** 最后一步索引 */
    lastStep: number = 0;
    /** 引导的节点 */
    guides: Map<number, GuideViewItem> = new Map();

    /** 资源文件夹 */
    res_dir = "gui/guide";
    /** 遮罩预制资源 */
    res_mask = "gui/guide/mask";
    /** 提示预制资源 */
    res_prompt = "gui/guide/prompt";

    /** 当前准备引导的节点 */
    get curNode(): Node | undefined {
        return this.guides.get(this.curStep)?.node;
    }

    /** 当前引导配置 */
    get curGuideInfo() {
        if (guideConfigs[this.curStep] == null) {
            console.error(`引导配置【${this.curStep}】不存在`);
            return null;
        }
        return guideConfigs[this.curStep];
    }

    /** 注册引导项 */
    register(step: number, itemView: GuideViewItem) {
        // 配置引导节点
        if (guideConfigs[step] && !this.guides.has(step)) {
            this.guides.set(step, itemView);
            guideConfigs[step].targetNode = itemView.node;
            console.log(`注册引导节点【${step}】`);
        } else {
            console.error(`注册引导节点【${step}】失败`);
        }
    }

    reset(): void {
        this.curStep = -1;
        this.lastStep = 0;

        this.guides.forEach(node => {
            if (node.isValid) node.getComponent(GuideViewItem)!.destroy();
        });
        this.guides.clear();
    }
}