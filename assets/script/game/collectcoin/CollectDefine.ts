import { Vec3 } from "cc";


/** 离线收集配置 */
export interface offlineCoinConfig {
    id: number; // 星兽ID
    createdAt: string; // 创建时间
    updatedAt: string; // 更新时间
    freeRatia: number; // 免费收集金币的比例，以百分比表示，例如10%
    payGoldCoinType: number; // 付费收集全部金币的消耗的货币类型 (1.金币, 2.宝石, 3.星兽币, 4.USDT)
    payGoldCoinNum: number; // 付费收集全部金币的消耗的货币数量
}



export class CollectInfo {
    startPos: Vec3 = new Vec3();
}