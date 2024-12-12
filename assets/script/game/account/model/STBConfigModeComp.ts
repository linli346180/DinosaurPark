import { _decorator, Component, Node } from 'cc';
import { ecs } from '../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS';
const { ccclass, property } = _decorator;


@ecs.register('STBConfigMode')
export class STBConfigModeComp extends ecs.Comp {
    instbConfigData: UserInstbConfigData[] = [];
    reset(): void {
        this.instbConfigData = [];
    }

    /** 获取星兽配置数据 */
    getSTBConfigData(configId: number): UserInstbConfigData | undefined {
        return this.instbConfigData.find((element) => element.id === configId);
    }

    /** 获取下一级星兽配置数据 */
    getNextSTBConfigData(configId: number): UserInstbConfigData | undefined {
        const index = this.instbConfigData.findIndex((element) => element.id === configId);
        if (index !== -1) {
            const config = this.instbConfigData[index];
            for (const item of this.instbConfigData) {
                if (item.stbKinds === config.stbKinds && item.stbGrade === config.stbGrade + 1) {
                    return item;
                }
            }
        }
        return undefined;
    }
}

/** 星兽配置 */
export interface UserInstbConfigData {
    readonly id: number;                 // 星兽ID
    readonly stbKinds: StbKinds;         // 星兽种类(1.黄金星兽,2.宝石星兽,3.至尊星兽,4.钻石星兽)
    readonly stbName: string;            // 星兽名称
    readonly stbGrade: number;           // 星兽等级
    readonly isIncome: IsIncome;         // 是否可以收益(1.是,2.否)
    readonly stbSurvival: number;        // 星兽存活时间(秒) 0表示永久存活
    // readonly incomeType: IncomeType;     // 收益货币的类型(1.金币,2.宝石,3.星兽币,4.USDT)
    readonly incomeCycle: number;        // 收益周期(秒)
    readonly incomeNumMin: number;       // 最小收益数量
    // readonly incomeNumMax: number;       // 最大收益数量
    // readonly incomeGetOpport: number;    // 收益获得时机(1.存活期间获得,2.死亡后计算)
    // readonly incomeGetMethod: number;    // 收益获得方式(1.点击领取,2.邮件领取)
    readonly isPur: IsPur;               // 是否可以购买
    readonly purConCoin: PurConCoin;     // 购买消耗货币类型(1.金币,2.宝石,3.星兽币,4.USDT)
    purConCoinNum: number;      // 购买消耗货币数量
    // createdAt: string | null;
    // updatedAt: string | null;
    // desc: string| null;
}

export enum StbKinds {
    gold = 1,
    gems,
    super,
    diamond
}

export enum IsIncome {
    Yes = 1,
    No = 2
}

export enum IsPur {
    Yes = 1,
    No
}

export enum PurConCoin {
    gold = 1,
    gems,
    starBeast,
    usdt
}

export enum IncomeType {
    gold = 1,
    gems,
    starBeast,
    usdt
}

