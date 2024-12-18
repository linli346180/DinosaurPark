import { _decorator } from "cc";
import { smc } from "../../common/SingletonModuleComp";
import { STBConfigType } from "../../character/STBDefine";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { UserInstbConfigData } from "../model/STBConfigModeComp";

/** 视图层对象 - 支持 MVVM 框架的数据绑定 */
/** 用户金币池 */
export class CoinPoolViewModel {

    /** 10级黄金星配置 */
    private m_goldConfig: UserInstbConfigData = null;
    get GoldConfig(): UserInstbConfigData {
        if (!this.m_goldConfig) {
            this.m_goldConfig = smc.account.getSTBConfigByType(STBConfigType.STB_Gold_Level10);
        }
        return this.m_goldConfig;
    }

    /** 10级黄金星兽(收益数量) */
    get GoldInComeNum(): number {
        const goldstbList = smc.account.getSTBDataByConfigType(STBConfigType.STB_Gold_Level10);
        return Math.min(goldstbList.length, 10);
    }

    /** 10级黄金星兽(每秒收益) */
    private m_gold_speed: number = 0;
    get GoldSpeed(): number {
        const speed = smc.account.AccountModel.propData.propMultiplier;
        this.m_gold_speed = this.GoldInComeNum * Number(this.GoldConfig.incomeNumMin) / Number(this.GoldConfig.incomeCycle) * Number(speed);
        console.log(`收益星兽数量(黄金):${this.GoldInComeNum} 加速度:${speed} 每秒收益:${ (this.GoldConfig.incomeNumMin / this.GoldConfig.incomeCycle).toFixed(2)}`);
        return this.m_gold_speed;
    }
}

export let coinPoolVM = new CoinPoolViewModel();