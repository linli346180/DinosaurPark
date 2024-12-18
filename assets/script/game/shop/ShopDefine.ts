

/** 收益星兽合成配置 */
export class STBSynthConfig {
    baseProb: number = 5;    // 基础概率
    upProb: number = 15;    // 宝石提升后的概率
    conCoinType: number = 2;    // 消耗货币的类型
    conCoinNum: number = 200;    // 消耗货币的数量
}

export class BuyGemsConfig {
    id: number = 0;
    dollarAmount: number = 0;       // 美元金额
    gemsNumber: number = 0;         // 宝石数量
    rebate: number = 0;             // 返现比例
    firstCharge:boolean = true;     // 是否首充
}

/** 道具配置 */
export interface PropConfig {
    readonly id: number;                  // 道具id
    readonly propName: string;            // 道具名称
    readonly propType: number;            // 道具类型 1为加速卡
    readonly propMultiplier: string;      // 倍率
    readonly duration: number;            // 道具持续时间（秒）
    readonly isPurchasable: number;       // 是否免费 1:免费 2：付费
    readonly coinType: number;            // 1.金币 2.宝石 3.星兽币 4.USDT
    readonly amount: string;              // 价格
}

/** 免费道具配置 */
export interface FreePropsData {
    readonly id: number;                  // 道具id 当id=0 的时候表示当前免费道具在今天已用过
    readonly propName: string;            // 道具名称
    readonly propIcon: string;            // 道具图标
    readonly propType: number;            // 道具类型
    readonly propMultiplier: string;      // 倍率
    readonly duration: number;            // 持续时间（单位秒）
    readonly isPurchasable: number;       // 是否免费：1免费 2需购买
    readonly coinType: number;            // 货币类型 1.金币 2.宝石 3.星兽币 4.USDT
    readonly amount: string;              // 价格
}