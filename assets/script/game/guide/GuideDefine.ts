

export class PresellInfo {
    public officialChannelUrl: string;    // 官方频道链接
    public officialGroupUrl: string;        // 官方群链接
    public xUrl: string;                    // X链接
    public gameOnlineAt: number;            // 游戏上线时间
    public rewardNum: number;               // 奖励数量
    public newUserRewardArr: GuideRewardInfo[] = [];
    
    constructor() {
        this.officialChannelUrl = 'https://t.me/StarBeastParkANN'; // Initialize officialChannelUrl property
        this.officialGroupUrl = 'https:t.me/StarBeastPark'; // Initialize officialGroupUrl property
        this.xUrl = 'https://x.com/starbeastpark'; // Initialize xUrl property
        this.gameOnlineAt = 0; // Initialize gameOnlineAt property
        this.rewardNum = 0; // Initialize rewardNum property
    }
}

export class GuideRewardInfo {
    rewardType: number = 0;          // 奖励类型
    rewardGoodsID: number = 0;      // 奖励物品ID
    goodName: string = '';          // 奖励名称
    rewardNum: number = 0           // 奖励数量
}

export class UserOfficial {
    public joinOfficialChannel: number;    // 是否加入官方频道
    public joinOfficialGroup: number;        // 是否加入官方群组
    public joinX: number;                    // 是否加入X
    public scorpionReward:number;            // 是否领取过新手奖励,0-已领取，1-未领取
    public rewards: GuideRewardInfo[] = [];
}

// export class UserReward {
//     rewardType: number = 0;          // 奖励类型
//     rewardGoodsID: number = 0;      // 奖励物品ID
//     goodName: string = '';          // 奖励名称
//     rewardNum: number = 0           // 奖励数量
// }