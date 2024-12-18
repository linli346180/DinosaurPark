import { HttpManager } from "../../net/HttpManager";
import { netConfig } from "../../net/custom/NetConfig";
import { NetErrorCode } from "../../net/custom/NetErrorCode";
import { RankType, STBType, UserRankData } from "./RankDefine";

export namespace RankNetService {
    /** 拉新排行榜 */
    export async function getInviteRankData(rankingType: RankType) {
        const http = new HttpManager();
        const response = await http.getUrl(`tgapp/api/user/invite/searchLeaderboard?rankingType=${rankingType}&token=${netConfig.Token}`);
        if (response.isSucc && response.res.resultCode == NetErrorCode.Success) {
            console.warn("拉新排行榜:", response.res.leaderboard);
            let rankData = new UserRankData();
            if (response.res.leaderboard.rankList) {
                rankData.rankList = response.res.leaderboard.rankList;
            }
            if (response.res.leaderboard.userRank) {
                rankData.userRank = response.res.leaderboard.userRank;
            }
            return rankData;
        } else {
            console.error("拉新排行榜异常", response);
            return null;
        }
    }

    /** 财富排版版 */
    export async function getCoinRankData() {
        const http = new HttpManager();
        const response = await http.getUrl(`tgapp/api/user/coin/leaderboard?token=${netConfig.Token}`);
        if (response.isSucc && response.res.resultCode == NetErrorCode.Success) {
            console.warn("财富排行版:", response.res.leaderboard);
            let rankData = new UserRankData();
            if (response.res.leaderboard.rankList) {
                rankData.rankList = response.res.leaderboard.rankList;
            }
            if (response.res.leaderboard.userRank) {
                rankData.userRank = response.res.leaderboard.userRank;
            }
            return rankData;
        } else {
            console.error("财富排行版异常", response);
            return null;
        }
    }

    /** 星兽排行版 */
    export async function getSTBRankData(stbId: number): Promise<UserRankData | null> {
        const http = new HttpManager();
        const response = await http.getUrl(`tgapp/api/user/stb/leaderboard?stbId=${stbId}&token=${netConfig.Token}`);
        if (response.isSucc && response.res.resultCode == NetErrorCode.Success) {
            console.warn("星兽排行版:", response.res.leaderboard);
            let rankData = new UserRankData();
            if (response.res.leaderboard.rankList) {
                rankData.rankList = response.res.leaderboard.rankList;
            }
            if (response.res.leaderboard.userRank) {
                rankData.userRank = response.res.leaderboard.userRank;
            }
            return rankData;
        } else {
            console.error("星兽排行版异常", response);
            return null;
        }
    }
}