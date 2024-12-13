import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/** 用户货币数据 */
export class UserCoinData {
    readonly id: number             = 0;
    readonly userID: number         = 0;      // 用户ID
    goldCoin: number                = 100;      // 金币(金币星兽产出)
    gemsCoin: number                = 0;      // 宝石(宝石星兽产出)
    usdt: number                    = 0;      // USDT(钻石星兽产出)
    starBeastCoin: number           = 0;      // 星兽币(sbpc,至尊星兽产出)
}

/** 货币池数量 */
export class UserCoinIncome {
    goldCoin: number                = 0; // 金币
    gemsCoin: number                = 0; // 宝石数量
}

// 所需货币类型枚举
export enum CoinType {
    Gold = 1,       // 金币
    Gems,           // 宝石
    StarBeast,      // 星兽币
    USDT            // USDT
}
