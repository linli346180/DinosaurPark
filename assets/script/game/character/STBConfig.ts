import { STBTypeID, StbKind } from "./STBDefine";


export interface ISTBConfigData {
    perfab: string; // 预制体
    mapID: number; // 地图
}

export var STBConfigData: { [key: number]: ISTBConfigData } = {
    [STBTypeID.STB_Gold_Level10]: { perfab: "animation/黄金星兽Lv10/STB_Gold", mapID: 1 },
    [STBTypeID.STB_Super_Level1]: { perfab: "animation/至尊星兽Lv1/STB_Super_Level1", mapID: 2 },
    [STBTypeID.STB_Super_Level2]: { perfab: "animation/至尊星兽Lv2/STB_Super_Level2", mapID: 2 },
    [STBTypeID.STB_Super_Level3]: { perfab: "animation/至尊星兽Lv3/STB_Super_Level3", mapID: 2 },
    [STBTypeID.STB_Gem]: { perfab: "animation/宝石星兽/STB_Gem", mapID: 2 },
    [STBTypeID.STB_Diamond]: { perfab: "animation/砖石星兽/STB_Diamond", mapID: 2 },
}
