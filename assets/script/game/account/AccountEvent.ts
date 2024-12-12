import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/** 账号模块全局事件 */
export enum AccountEvent {
    /** 切换多语言 */
    ChangeLanguage = "ChangeLanguage",

    /** 获取到配置 */
    STBConfigSuccess = "STBConfigSuccess",

    /** 修改头像 */
    ChangeAvatar = "ChangeAvatar",
    /** 修改昵称 */
    ChangeNickName = "ChangeNickName",
    /** 修改邮箱 */
    ChangeEmail = "ChangeEmail",

    RedDotCmd = "RedDotCmd",  // 红点命令

    LevelUpUnIncomeSTB = "LevelUpUnIncomeSTB",  // 无收益星兽升级
    EvolveUnIncomeSTB = "EvolveUnIncomeSTB",    // 无收益星兽进化

    AddInComeSTB = "AddInComeSTB",              // 添加收益星兽
    DelIncomeSTB = "DelIncomeSTB",              // 删除收益星兽
    AddUnIncomeSTB = "AddUnIncomeSTB",          // 添加无收益星兽
    AutoAddUnIncomeSTB = "AutoAddUnIncomeSTB",  // 添加无收益星兽(空投)
    DelUnIncomeSTB = "DelUnIncomeSTB",          // 删除无收益星兽
    UpdateUnIncomeSTB = "UpdateUnIncomeSTB",    // 更新无收益星兽(更新背包)
    UserCollectGold = "UserCollectCoin",        // 用户收集金币
    UserBounsUSTD = "UserBounsSTD",             // USDT奖励
    CoinDataChange = "CoinDataChange",          // 用户货币数据变化

    CoinExtraPrizeChange = "CoinExtraPrizeChange",  // 金币浮动价格变化
    GemExtraPrizeChange = "GemExtraPrizeChange",  // 

    OfflineIncome = "OfflineIncome",  // 离线收益

    UserNoOperation = "UserNoOperation",  // 长时间无操作
    UserOperation = "UserOperation",  // 用户操作
    HideUserOperation = "HideUserOperation",  // 用户操作
}
