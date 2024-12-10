import { FinishConditon, GuideInfo } from "./GuideDefine";


// 引导配置数据 
export let guideConfigs: { [key: number]: GuideInfo } = {
    1: { 
        stepId: 1, 
        prompt: "点击领养星兽", 
        raiseClick: true, 
        condition: FinishConditon.CLICK, 
        gameEvent: "" ,
        targetNode: null!},
    2: { 
        stepId: 2, 
        prompt: "切换领养星兽", 
        raiseClick: true, 
        condition: FinishConditon.CLICK, 
        gameEvent: "" ,
        targetNode: null!},
    // 其他初始化数据...
};