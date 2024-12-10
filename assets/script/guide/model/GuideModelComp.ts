/*
 * @Author: dgflash
 * @Date: 2022-03-21 11:12:03
 * @LastEditors: dgflash
 * @LastEditTime: 2022-09-06 10:12:03
 */
import { Node } from "cc";
import { GuideViewItem } from "../view/GuideViewItem";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";

/** 引导数据 */
@ecs.register('GuideModel')
export class GuideModelComp extends ecs.Comp {
    /** 当前引导步骤 */
    curStep: number = 1;
    /** 最后一步索引 */
    lastStep: number = Number.MAX_VALUE;
    /** 引导的节点 */
    guides: Map<number, Node> = new Map();

    /** 资源文件夹 */
    res_dir = "gui/guide";
    /** 遮罩预制资源 */
    res_mask = "gui/guide/mask";
    /** 提示预制资源 */
    res_prompt = "gui/guide/prompt";

    /** 当前准备引导的节点 */
    get current(): Node | undefined {
        return this.guides.get(this.curStep);
    }

    reset(): void {
        this.curStep = 1;
        this.lastStep = Number.MAX_VALUE;

        this.guides.forEach(node => {
            if (node.isValid) node.getComponent(GuideViewItem)!.destroy();
        });
        this.guides.clear();
    }
}