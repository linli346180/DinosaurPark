


export enum RankGroup {
    Invite = 0,         // 拉新排行榜
    Rich,               // 富豪榜
    STB,               // 星兽榜
}

export enum RankType {
    day = 0,
    week = 1,
    month = 2,
}

export enum STBType {
    primarySTB = 0,
    intermediateSTB = 1,
    seniorSTB = 2,
}

export class RankDataList {
    richRank: UserRankData;
    dayInviteRank: UserRankData;
    weekInviteRank: UserRankData;
    monthInviteRank: UserRankData;
    primarySTBRank: UserRankData;
    intermediateSTBRank: UserRankData;
    seniorSTBRank: UserRankData;

    constructor() {
        this.richRank;
        this.dayInviteRank;
        this.weekInviteRank;
        this.monthInviteRank;
        this.primarySTBRank;
        this.intermediateSTBRank;
        this.seniorSTBRank;
    }

    fillData(data: UserRankData,rankGroup: RankGroup,rankType?: RankType,STBtype?: STBType) {
        switch (rankGroup) {
            case RankGroup.Invite:
                switch (rankType) {
                    case RankType.day:
                        this.dayInviteRank = data;
                        break;
                    case RankType.week:
                        this.weekInviteRank = data;
                        break;
                    case RankType.month:
                        this.monthInviteRank = data;
                        break;
                }
                break;
            case RankGroup.Rich:
                this.richRank = data;
                break;
            case RankGroup.STB:
                switch (STBtype) {
                    case STBType.primarySTB:
                        this.primarySTBRank = data;
                        break;
                    case STBType.intermediateSTB:
                        this.intermediateSTBRank = data;
                        break;
                    case STBType.seniorSTB:
                        this.seniorSTBRank = data;
                        break;
                }
                break;
        }
    }
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
    count: number;        //邀请人数   给接口后字段修改为count

    constructor() {
        this.ranking = 0;
        this.userID = 0;
        this.userName = '';
        this.count = 0;
    }
}