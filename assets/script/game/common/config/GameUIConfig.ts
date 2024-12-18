/*
 * @Date: 2021-08-12 09:33:37
 * @LastEditors: dgflash
 * @LastEditTime: 2023-02-15 09:38:36
 */
import { LayerType, UIConfig } from "../../../../../extensions/oops-plugin-framework/assets/core/gui/layer/LayerManager";


/** 界面唯一标识（方便服务器通过编号数据触发界面打开） */
export enum UIID {
    /** 资源加载界面 */
    Loading = 1,
    /** 提示弹出窗口 */
    Alert,
    /** 确认弹出窗口 */
    Confirm,
    Notify,
    Wait,
    Main,           // 游戏主界面
    User,           // 用户中心
    Map,            // 地图
    Invite,         // 邀请
    Task,           // 任务
    Book,           // 图鉴
    Email,          // 邮件
    EmailDetail,    // 邮件详情
    STBShop,        // 星兽商店
    STBMerge,       // 星兽合并商店

    Revive,         // 复活
    DebrisResult,   // 碎片拼图结果
    Hatch,          // 扭蛋机
    RewardView,     // 奖励界面
    HatchShop,      // 孵化次数商店
    HatchReward,    // 孵化奖励
    RankUI,         // 排行榜
    LanguageUI,     // 多语言设置
    Activity,       // USDT活动
    GuideChannel,   // 新手引导关注频道
    GuideReward,    // 新手大礼包
    Wallet,         // 钱包
    EmailVerify,    // 邮箱验证
    WalletDetail,   // 钱包详情
    STBDetail,      // 星兽详情

    GemShop,        // 宝石商店
    PropShop,       // 道具商店
    WalletPaySelect, // 钱包支付选择
    Keyboard,       // 虚拟键盘

    Evolve,         // 星兽进化
    EvolveTips,     // 星兽进化提示
    EvolveResult,   // 星兽进化提示
    CollectCoin,    // 收集金币

    Accelerate,     // 加速
}

/** 打开界面方式的配置数据 */
export var UIConfigData: { [key: number]: UIConfig } = {
    [UIID.Loading]: { layer: LayerType.Dialog, prefab: "gui/loading/loading" },
    [UIID.Alert]: { layer: LayerType.System, prefab: "common/prefab/alert", mask: true },
    [UIID.Confirm]: { layer: LayerType.Dialog, prefab: "common/prefab/confirm" },
    [UIID.Notify]: { layer: LayerType.Notify, prefab: "common/prefab/notify" },
    [UIID.Wait]: { layer: LayerType.Notify, prefab: "common/prefab/wait" },

    // 游戏主界面
    [UIID.Map]: { layer: LayerType.UI, prefab: "gui/map/prefab/map" },
    [UIID.Main]: { layer: LayerType.UI, prefab: "gui/game/prefab/home" },
    [UIID.Task]: { layer: LayerType.UI, prefab: "gui/task/prefab/task" },
    [UIID.CollectCoin]: { layer: LayerType.PopUp, prefab: "gui/collectcoin/prefab/collectcoin", mask: true, preLoad: true },
    

    // 个人中心
    [UIID.User]: { layer: LayerType.PopUp, prefab: "gui/setting/usercenter", mask: true, preLoad: true },
    [UIID.EmailVerify]: { layer: LayerType.Dialog, prefab: "gui/setting/emailVerify", mask: true, preLoad: true },
    [UIID.LanguageUI]: { layer: LayerType.Dialog, prefab: "gui/setting/languageView", mask: true, vacancy: true, preLoad: true },
    [UIID.Keyboard]: { layer: LayerType.System, prefab: "gui/keyboard/Keyboard", mask: true, vacancy: true, preLoad: true },

    // 邮件
    [UIID.Email]: { layer: LayerType.UI, prefab: "gui/email/prefab/emailUI", preLoad: true },
    [UIID.EmailDetail]: { layer: LayerType.PopUp, prefab: "gui/email/prefab/emailDetailUI", mask: true, preLoad: true },

    // 抽奖
    [UIID.Hatch]: { layer: LayerType.UI, prefab: "gui/hatch/prefab/hatch", preLoad: true },
    [UIID.HatchReward]: { layer: LayerType.PopUp, prefab: "gui/hatch/prefab/hatchReward", mask: true, preLoad: true },

    // 进化
    [UIID.Evolve]: { layer: LayerType.UI, prefab: "gui/evolve/evolveUI", preLoad: true },
    [UIID.EvolveTips]: { layer: LayerType.UI, prefab: "gui/evolve/evolveTipsUI", mask: true },
    [UIID.EvolveResult]: { layer: LayerType.PopUp, prefab: "gui/evolve/evolveResult", mask: true },

    // 排行榜
    [UIID.RankUI]: { layer: LayerType.UI, prefab: "gui/rank/prefab/ranklUI", mask: true, preLoad: true },

    // USDT提现
    [UIID.Wallet]: { layer: LayerType.UI, prefab: "gui/wallet/walletUI", preLoad: true },
    [UIID.WalletDetail]: { layer: LayerType.UI, prefab: "gui/wallet/walletDetailUI", preLoad: true },
    [UIID.WalletPaySelect]: { layer: LayerType.PopUp, prefab: "gui/wallet/prefab/walletPaySelect", mask: true, preLoad: true },

    // USDT活动
    [UIID.Activity]: { layer: LayerType.UI, prefab: "gui/activity/activityUI", mask: true },

    // 新手奖励
    [UIID.GuideChannel]: { layer: LayerType.UI, prefab: "gui/guide/guideUI", mask: true, preLoad: true },
    [UIID.GuideReward]: { layer: LayerType.PopUp, prefab: "gui/guide/guideReward", mask: true, preLoad: true },

    // 图鉴
    [UIID.Book]: { layer: LayerType.PopUp, prefab: "gui/book/prefab/stbReportUI", mask: true, vacancy: true, preLoad: true },
    [UIID.STBDetail]: { layer: LayerType.Dialog, prefab: "gui/book/prefab/stbDetail", mask: true, vacancy: true },

    // 邀请
    [UIID.Invite]: { layer: LayerType.UI, prefab: "gui/invite/prefab/invite" },

    // 商店
    [UIID.PropShop]: { layer: LayerType.PopUp, prefab: "gui/shop/prefab/propShop", mask: true },
    [UIID.GemShop]: { layer: LayerType.PopUp, prefab: "gui/shop/prefab/gemShop", mask: true },
    [UIID.Accelerate]: { layer: LayerType.PopUp, prefab: "gui/shop/prefab/accelerate", mask: true, preLoad: true },
}