import { AccountEvent } from "../game/account/AccountEvent";
import { FinishConditon, GuideInfo } from "./GuideDefine";


export function guideConfigsLength(): number {
    const length = Object.keys(guideConfigs).length;
    console.log(`guideConfigs 的长度: ${length}`);
    return length;
}

// 引导配置数据 
export let guideConfigs: { [key: number]: GuideInfo } = {
    1: {
        name: "领养星兽",
        prompt: "guide_01",
        emitClickEvent: false,
        gameEvent: AccountEvent.ShowKnapsackView,
    },
    2: {
        name: "切换星兽(右)",
        prompt: "guide_02",
        emitClickEvent: true,
        gameEvent: "",
    },
    3: {
        name: "切换星兽(左)",
        prompt: "guide_03",
        emitClickEvent: true,
        gameEvent: "",
    },
    4: {
        name: "背包",
        prompt: "guide_04",
        emitClickEvent: false,
        gameEvent: AccountEvent.UserNoOperation,
    },
    5: {
        name: "关闭背包",
        prompt: "guide_05",
        emitClickEvent: true,
        gameEvent: "",
    },
    6: {
        name: "打开背包",
        prompt: "guide_06",
        emitClickEvent: false,
        gameEvent: "",
    },
    7: {
        name: "进化",
        prompt: "guide_07",
        emitClickEvent: true,
        gameEvent: "",
    },
    8: {
        name: "中级星兽",
        prompt: "guide_08",
        emitClickEvent: true,
        gameEvent: "",
    },
    9: {
        name: "初级星兽",
        prompt: "guide_09",
        emitClickEvent: true,
        gameEvent: "",
    },

    10: {
        name: "增加次数",
        prompt: "guide_10",
        emitClickEvent: true,
        gameEvent: "",
    },
    11: {
        name: "减少次数",
        prompt: "guide_11",
        emitClickEvent: true,
        gameEvent: "",
    },
    12: {
        name: "进化",
        prompt: "guide_12",
        emitClickEvent: false,
        gameEvent: "",
    },
    13: {
        name: "退出",
        prompt: "guide_13",
        emitClickEvent: true,
        gameEvent: "",
    },
    // 其他初始化数据...
};