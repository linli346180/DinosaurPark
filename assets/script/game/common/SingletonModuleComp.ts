/*
 * @Author: dgflash
 * @Date: 2021-11-18 14:20:46
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-08 12:04:30
 */

import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { GuideEntity } from "../../guide/entity/GuideEntity";
import { Account } from "../account/Account";
import { CoinEntity } from "../coin/entity/CoinEntity";
import { Initialize } from "../initialize/Initialize";

/** 游戏单例业务模块 */
@ecs.register('SingletonModule')
export class SingletonModuleComp extends ecs.Comp {
    /** 游戏初始化模块 */
    initialize: Initialize = null!;
    /** 游戏账号模块 */
    account: Account = null!;
    /** 游戏初始化模块 */
    guide: GuideEntity = null!;
    /** 货币数据模块 */
    coin: CoinEntity = null!;

    reset() { }
}

export var smc: SingletonModuleComp = ecs.getSingleton(SingletonModuleComp);