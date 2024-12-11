import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { GuideModelComp } from "../model/GuideModelComp";
import { GuideViewComp } from "../view/GuideViewComp";

@ecs.register('Guide')
export class GuideEntity extends ecs.Entity {
    GuideModel!: GuideModelComp;
    GuideView!: GuideViewComp;

    protected init() {
        this.addComponents<ecs.Comp>(GuideModelComp);
    }

    /** 检查引导是否完成 */
    get isFinish() {
        console.log("引导完成【" + oops.storage.getBoolean("GuideFinish") + "】");
        return oops.storage.getBoolean("GuideFinish");
    }
    set isFinish(value: boolean) {
        console.log("设置引导完成【" + value + "】");
        oops.storage.set("GuideFinish", value);
    }

    /** 开启新手引导 */
    startGuide(callback: Function) {
        oops.res.loadDir(this.GuideModel.res_dir, (err: Error | null) => {
            if (err) {
                console.error("引手引导资源加载失败");
            }
            // 注册显示对象到 ECS 实体中
            var gv = oops.gui.guide.addComponent(GuideViewComp);
            this.add(gv);
            gv.init(this.GuideModel);
            if(callback) callback();
        });
    }

    destroy(): void {
        oops.res.releaseDir(this.GuideModel.res_dir);
        this.remove(GuideViewComp);
        this.remove(GuideModelComp);
        super.destroy();
    }
}


