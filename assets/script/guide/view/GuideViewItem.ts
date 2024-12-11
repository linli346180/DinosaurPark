/*
 * @Author: dgflash
 * @Date: 2022-03-14 11:18:54
 * @LastEditors: dgflash
 * @LastEditTime: 2022-04-13 10:34:33
 */
import { CCInteger, Component, _decorator } from "cc";
import { smc } from "../../game/common/SingletonModuleComp";
import { CCComp } from "../../../../extensions/oops-plugin-framework/assets/module/common/CCComp";

const { ccclass, property } = _decorator;

/** 新手引导数据（绑定到引导节点上） */
@ccclass('GuideViewItem')
export class GuideViewItem extends CCComp {
    @property({ type: CCInteger })
    stepId: number = 0;

    start() {
        console.log("guide register", this.node.name);
        // 注册引导数据
        var gm = smc.guide?.GuideModel;
        if (gm) {
            gm.register(this.stepId, this);
        }
        var gv = smc.guide.GuideView;
        if (gv) {
            if(gm.curStep == this.stepId) {
                gv.check(this.stepId);
            }
        }
    }

    update(dt: number) {
        var gm = smc.guide?.GuideModel;
        var gv = smc.guide.GuideView;
        if (gm && gv) {
            // 验证当前是否触发这个引导
            if (gm.curStep == this.stepId) {
                gv.refresh();
            }
        }
    }

    reset(): void {

    }
}
