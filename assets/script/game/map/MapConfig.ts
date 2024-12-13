import { Vec2 } from "cc";

export enum MapID {
    // 初级地图
    Map1 = 1,
    // 中级地图
    Map2 = 2,
}

export interface IMapConfig {
    /** 地图编号 */
    id: MapID;
    /** 地图名称 */
    path?: string;
    /** 地图宽度 */
    width: number;
    /** 锚点 */
    center: number;
    /** 出生点 */
    spawnPoint?: { x: number, y: number }[];
    /** 宽度限制 */
    widthLimit: Vec2;
    /** 高度限制 */
    heightLimit: Vec2;
    /** 数量限制 */
    ItemLimit: number;
}

/** 打开界面方式的配置数据 */
export var mapConfig: IMapConfig = {
    id: MapID.Map1, 
    path: "Map1", 
    width: 1080, center: 540,
    widthLimit: new Vec2(-300, 300),
    heightLimit: new Vec2(-400, 500),
    ItemLimit: 10
}