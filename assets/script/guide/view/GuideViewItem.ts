/*
 * @Author: dgflash
 * @Date: 2022-03-14 11:18:54
 * @LastEditors: dgflash
 * @LastEditTime: 2022-04-13 10:34:33
 */
import { CCInteger, Component, _decorator } from "cc";
import { smc } from "../../game/common/SingletonModuleComp";

const { ccclass, property } = _decorator;

/** 新手引导数据（绑定到引导节点上） */
@ccclass('GuideViewItem')
export class GuideViewItem extends Component {
    @property({
        type: [CCInteger]
    })
    stepId: number = -1;

    start() {
        var gm = smc.guide?.GuideModel;
        if (gm && smc.guide.GuideView) {
            var gv = smc.guide.GuideView;

            // 注册引导数据
            gv.register(this.stepId, this.node);

            // 验证当前是否触发这个引导
            if (gm.curStep == this.stepId) {
                gv.check();
            }
        }
    }

    update(dt: number) {
        var gm = smc.guide?.GuideModel;
        if (gm) {
            var gv = smc.guide.GuideView;
            // 验证当前是否触发这个引导
            if (gm.curStep == this.stepId) {
                gv.refresh();
            }
        }
    }
}
