export enum RankGroup {
    Invite = 0,         // 拉新排行榜
    Rich,               // 富豪榜
    STB,                // 星兽榜
}

export enum RankType {
    day = 0,
    week = 1,
    month = 2,
}

export enum STBType {
    primarySTB = 301,
    intermediateSTB = 302,
    seniorSTB = 303,
}

export class RankDataList {
    richRank: UserRankData = null;
    dayInviteRank: UserRankData = null;
    weekInviteRank: UserRankData = null;
    monthInviteRank: UserRankData = null;
    primarySTBRank: UserRankData = null;
    intermediateSTBRank: UserRankData = null;
    seniorSTBRank: UserRankData = null;

    fillData(data: UserRankData, rankGroup: RankGroup, rankType?: RankType, STBtype?: STBType) {
        switch (rankGroup) {
            case RankGroup.Invite:
                this.setInviteRankData(data, rankType);
                break;
            case RankGroup.Rich:
                this.richRank = data;
                break;
            case RankGroup.STB:
                this.setSTBRankData(data, STBtype);
                break;
        }
    }

    private setInviteRankData(data: UserRankData, rankType?: RankType) {
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
    }

    private setSTBRankData(data: UserRankData, STBtype?: STBType) {
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
    }

    getRankData(rankGroup: RankGroup, rankType?: RankType, STBtype?: STBType) {
        switch (rankGroup) {
            case RankGroup.Invite:
                return this.getInviteRankData(rankType);
            case RankGroup.Rich:
                return this.richRank;
            case RankGroup.STB:
                return this.getSTBRankData(STBtype);
        }
    }

    private getInviteRankData(rankType?: RankType) {
        switch (rankType) {
            case RankType.day:
                return this.dayInviteRank;
            case RankType.week:
                return this.weekInviteRank;
            case RankType.month:
                return this.monthInviteRank;
        }
    }

    private getSTBRankData(STBtype?: STBType) {
        switch (STBtype) {
            case STBType.primarySTB:
                return this.primarySTBRank;
            case STBType.intermediateSTB:
                return this.intermediateSTBRank;
            case STBType.seniorSTB:
                return this.seniorSTBRank;
        }
    }
}

export class UserRankData {
    rankList: RankData[];  // 排行榜
    userRank: RankData;    // 用户排名      

    constructor() {
        this.rankList = [];
        this.userRank = new RankData();
    }
}

export class RankData {
    ranking: number;            // 排名
    userID: number;             // 用户id
    userName: string;           // 用户名称
    count: number;              // 邀请人数

    curRankType: RankGroup;     // 当前排行榜类型
    STBRankType: STBType;       // 星兽排行榜类型

    constructor() {
        this.ranking = 0;
        this.userID = 0;
        this.userName = '';
        this.count = 0;
        this.curRankType = RankGroup.Invite;
        this.STBRankType = STBType.primarySTB;
    }
}