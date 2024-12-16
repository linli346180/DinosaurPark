/*
 * @Author: dgflash
 * @Date: 2022-07-22 17:06:22
 * @LastEditors: bansomin
 * @LastEditTime: 2024-03-31 01:20:18
 */
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { JsonUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/JsonUtil";
import { AsyncQueue, NextFunction } from "../../../../../extensions/oops-plugin-framework/assets/libs/collection/AsyncQueue";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { ModuleUtil } from "../../../../../extensions/oops-plugin-framework/assets/module/common/ModuleUtil";
import { Account } from "../../account/Account";
import { AccountEvent } from "../../account/AccountEvent";
import { GameEvent } from "../../common/config/GameEvent";
import { UIID } from "../../common/config/GameUIConfig";
import { smc } from "../../common/SingletonModuleComp";
import { TableItemConfig } from "../../common/table/TableItemConfig";
import { TableMiddleDebrisConfig } from "../../common/table/TableMiddleDebrisConfig";
import { TablePrimaryDebrisConfig } from "../../common/table/TablePrimaryDebrisConfig";
import { TableSTBConfig } from "../../common/table/TableSTBConfig";
import { Initialize } from "../Initialize";
import { LoadingViewComp } from "../view/LoadingViewComp";

/** 初始化游戏公共资源 */
@ecs.register('InitRes')
export class InitResComp extends ecs.Comp {
    reset() { }
}

/** 初始化资源逻辑注册到Initialize模块中 */
@ecs.register('Initialize')
export class InitResSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(InitResComp);
    }

    entityEnter(e: Initialize): void {
        var queue: AsyncQueue = new AsyncQueue();
        /** 加载远程资源配置 */
        this.loadBundle(queue);
        // 加载自定义资源
        // this.loadCustom(queue);
        // 加载多语言包加载多语言包
        // this.loadLanguage(queue);
        // 加载公共资源
        this.loadCommon(queue);
        // 加载游戏内容加载进度提示界面
        this.onComplete(queue, e);
        queue.play();
    }

    /** 加载远程资源配置 */
    private loadBundle(queue: AsyncQueue) {
        queue.push(async (next: NextFunction, params: any, args: any) => {
            oops.res.defaultBundleName = oops.config.game.bundleName;
            if (oops.config.game.bundleEnable) {
                console.log("启用远程资源运行游戏");
                await oops.res.loadBundle(oops.config.game.bundleServer, oops.config.game.bundleVersion);
            }
            else {
                console.log("启用本地资源运行游戏" + oops.config.game.bundleName);
                await oops.res.loadBundle(oops.config.game.bundleName);
            }
            next();
        });
    }

    /** 加载自定义内容（可选） */
    private loadCustom(queue: AsyncQueue) {
        queue.push(async (next: NextFunction, params: any, args: any) => {
            oops.res.load("language/font/" + oops.language.current, next);
            await JsonUtil.loadAsync(TableItemConfig.TableName);
            await JsonUtil.loadAsync(TablePrimaryDebrisConfig.TableName);
            await JsonUtil.loadAsync(TableMiddleDebrisConfig.TableName);
            await JsonUtil.loadAsync(TableSTBConfig.TableName);
        });
    }

    /** 加载化语言包（可选） */
    private loadLanguage(queue: AsyncQueue) {
        queue.push((next: NextFunction, params: any, args: any) => {
            // 设置默认语言
            let lan = oops.storage.getCommon("language");
            if (lan == null || lan == "") {
                lan = "en";
                oops.storage.setCommon("language", lan);
            }
            // 加载语言包资源
            oops.language.setLanguage(lan, next);
        });
    }

    /** 加载公共资源（必备） */
    private loadCommon(queue: AsyncQueue) {
        queue.push((next: NextFunction, params: any, args: any) => {
            oops.res.loadDir("common/prefab", next);
        });
    }

    /** 加载完成进入游戏内容加载界面 */
    private onComplete(queue: AsyncQueue, e: Initialize) {
        queue.complete = async () => {
            console.log("0.资源加载完成");
            // 应用初始化完成
            oops.message.dispatchEvent(GameEvent.APPInitialized)
            // 加载进度提示界面
            ModuleUtil.addViewUi(e, LoadingViewComp, UIID.Loading);
            e.remove(InitResComp);
        };
    }
}