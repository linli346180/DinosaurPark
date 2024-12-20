import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

// 奖励级别枚举
export enum RewardLevel {
    Normal = 1,    // 普通
    Intermediate,  // 中级
    Advanced,      // 高级
    Rare           // 稀有
}

// 奖励类型枚举
// export enum RewardType {
//     Currency = 1,       // 货币
//     StarBeast,          // 星兽
//     StarBeastFragment,  // 星兽碎片
//     Speed,              // 加速卡
// }

/** 孵蛋基础配置 */
export class UserHatchConfig {
    hatchNum: number = 0;           // 当前孵化次数
    readonly hatchTotal : number = 100;      // 孵化总次数
    readonly hatchPrice : number = 300;      // 孵化价格
    readonly hatchRecords: hatchRecord[] = [];    // 孵化记录
}

export class hatchRecord {
    userName: string;
    rewardType: number;
    rewardId: number;
    rewardQuantity: string;
}

/** 孵蛋结果 */
export class HatchResult {
    hatchNum: number = 0; 
    rewardList: RewardConfig[] = [];
}

// 奖励配置结构体
export interface RewardConfig {
    readonly goodName: string;          // 奖励名称
    readonly level: number;             // 奖励级别(1.普通,2.中级,3.高级,4.稀有)
    readonly rewardType: number;    // 奖励类型(1.货币,2.星兽,3.星兽碎片, 5加速卡)
    readonly rewardGoodsID: number;     // 奖励物品ID
    readonly rewardNum: number;         // 奖励数量
    readonly standbyID?: number;         // 备用ID(碎片的主表ID)
}