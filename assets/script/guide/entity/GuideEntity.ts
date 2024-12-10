import { UIOpacity } from "cc";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { GuideModelComp } from "../model/GuideModelComp";
import { GuideViewComp } from "../view/GuideViewComp";

@ecs.register('Guide')
export class GuideEntity extends ecs.Entity {
    GuideModel!: GuideModelComp;
    GuideView!: GuideViewComp;

    private uiOpacity: UIOpacity|null = null;

    protected init() {
        // console.log("新手引导开始");
    }

    /** 检查引导是否完成 */
    get GuideFinish() {
        console.log("引导完成【" + oops.storage.getBoolean("GuideFinish") + "】");
        return oops.storage.getBoolean("GuideFinish");
    }

    set GuideFinish(value: boolean) {
        console.log("设置引导完成【" + value + "】");
        oops.storage.set("GuideFinish", value);
    }

    /** 引导是否可见 */
    private _visable: boolean = false;
    set Visable (value: boolean) {
        this._visable = value;
        if (this.uiOpacity) {
            this.uiOpacity.opacity = value ? 255 : 0;
        }
    }

    /** 开启新手引导 */
    startGuide(callback: Function) {
        this.addComponents<ecs.Comp>(GuideModelComp);
        oops.res.loadDir(this.GuideModel.res_dir, (err: Error | null) => {
            if (err) {
                console.error("引手引导资源加载失败");
            }
            // 注册显示对象到 ECS 实体中
            var gv = oops.gui.guide.addComponent(GuideViewComp);
            this.uiOpacity = oops.gui.guide.addComponent(UIOpacity);
            this.Visable = false;
            this.add(gv);
            callback();
        });
    }

    /** 检查指定引导是否触发 */
    check(step: number) {
        console.error("验证引导【" + step + "】");
        if (this.GuideModel) {
            this.GuideModel.curStep = step;
            this.GuideView.check();
        }
    }

    destroy(): void {
        oops.res.releaseDir(this.GuideModel.res_dir);
        this.remove(GuideViewComp);
        this.remove(GuideModelComp);
        super.destroy();
    }
}


