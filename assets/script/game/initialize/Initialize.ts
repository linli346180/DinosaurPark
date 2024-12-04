/*
 * @Author: dgflash
 * @Date: 2021-11-11 17:45:23
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-03 10:07:14
 */
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { ModuleUtil } from "../../../../extensions/oops-plugin-framework/assets/module/common/ModuleUtil";
import { UIID } from "../common/config/GameUIConfig";
import { InitResComp } from "./bll/InitRes";
import { LoadingViewComp } from "./view/LoadingViewComp";

/**
 * 游戏进入初始化模块
 * 1、热更新
 * 2、加载默认资源
 */
@ecs.register('Initialize')
export class Initialize extends ecs.Entity {
    protected init() {
        // 初始化游戏公共资源
        this.add(InitResComp);
    }

    public shwoLoading() {
        ModuleUtil.addViewUi(this, LoadingViewComp, UIID.Loading);
    }

    public hideLoading() {
        ModuleUtil.removeViewUi(this, LoadingViewComp, UIID.Loading);
    }
}