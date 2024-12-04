import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

// 收益货币类型
export enum IncomeType {
    Gold = 1,   // 金币
    Gem = 2,    // 宝石
    STBC = 3,    // 星兽币
    USTD = 4,    // USTD
}

// 星兽种类
export enum StbKind {
    STB_Gold = 1,   // 黄金星兽
    STB_Gem = 2, // 宝石星兽
    STB_Diamond = 3, // 至尊星兽"
    STB_Super = 4, // 钻石星兽
}

//星兽名称
export enum STBName {
    STB_Gold_Level1     = "1级黄金星兽",
    STB_Gold_Level2     = "2级黄金星兽",
    STB_Gold_Level3     = "3级黄金星兽",
    STB_Gold_Level4     = "4级黄金星兽",
    STB_Gold_Level5     = "5级黄金星兽",
    STB_Gold_Level6     = "6级黄金星兽",
    STB_Gold_Level7     = "7级黄金星兽",
    STB_Gold_Level8     = "8级黄金星兽",
    STB_Gold_Level9     = "9级黄金星兽",
    STB_Gold_Level10    = "10级黄金星兽",
    STB_Super_Level1    = "初级至尊星兽",
    STB_Super_Level2    = "中级至尊星兽",
    STB_Super_Level3    = "高级至尊星兽",
    STB_Gem             = "宝石星兽",
    STB_Diamond         = "砖石星兽",
}

// 星兽配置ID
export enum STBTypeID {
    STB_Gold_Level1     = 101,
    STB_Gold_Level2     = 102,
    STB_Gold_Level3     = 103,
    STB_Gold_Level4     = 104,
    STB_Gold_Level5     = 105,
    STB_Gold_Level6     = 106,
    STB_Gold_Level7     = 107,
    STB_Gold_Level8     = 108,
    STB_Gold_Level9     = 109,
    STB_Gold_Level10    = 110,
    STB_Gem             = 201,
    STB_Super_Level1    = 301,
    STB_Super_Level2    = 302,
    STB_Super_Level3    = 303,
    STB_Diamond         = 401,
}