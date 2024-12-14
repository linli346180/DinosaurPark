


export enum RankGroup {
    Invite = 0,         // 拉新排行榜
    Rich,               // 富豪榜
    STB,               // 星兽榜
}

export enum RankType {
    day = 0,
    week = 1,
    month = 2,
    invite = 3,         
    rich = 4,               
    STB = 5, 
    primarySTB = 6,
    intermediateSTB = 7,
    seniorSTB = 8,
}

export class UserRankData {
    rankList: RankData[];  //排行榜
    userRank: RankData;    //用户排名 

    constructor() {
        this.rankList = [];
        this.userRank = new RankData();
    }
}

export class RankData {
    ranking: number;            //排名
    userID: number;             //用户id
    userName: string;           //用户名称
    inviteCount: number;        //邀请人数

    constructor() {
        this.ranking = 0;
        this.userID = 0;
        this.userName = '';
        this.inviteCount = 0;
    }
}