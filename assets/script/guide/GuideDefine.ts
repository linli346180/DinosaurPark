import { Node, Vec3 } from 'cc';


//单次引导的类型
export enum GuideStepType {     
    MUST = 1,       //强制引导
    FREE,           //非强制性
}

//引导配置单个step的接口定义
export interface GuideStepConfigInterface {     //引导stepConfig
    stepId: number                              
    name: string                                //引导名字，随意
    desc: string                                //引导描述，显示出来
    btnPath: string                             //按钮的路径
    type: GuideStepType                         //引导类型，见GuideType
    nextStepId?: number,                        //非必选，不填写，则引导执行之后中断，主要因为有些引导是要异步操作的，如有，则立即执行下一个引导
    fingerPosOffset?: Vec3                      //非必选，指针偏移量
    descPosOffset?: Vec3                        //非必选，描述偏移量
}

export enum FinishConditon {
    CLICK = 1,          // 触发点击
    WaitGameEvent,      // 等待游戏事件
}

//引导配置接口定义
export interface GuideInfo {     
    stepId: number;         //引导唯一id
    prompt: string;         //引导描述，显示出来
    targetNode: Node;       //目标节点
    raiseClick: boolean;    //触发点击事件

    condition: FinishConditon;   //触发类型
    gameEvent: string;      //触发事件
}