import { HttpManager } from "../../net/HttpManager";
import { netConfig } from "../../net/custom/NetConfig";
import { NetErrorCode } from "../../net/custom/NetErrorCode";
import { RankType, STBType, UserRankData } from "./RankDefine";

export namespace RankNetService {
    /** 拉新排行榜 */
    export async function getInviteRankData(rankingType: RankType): Promise<UserRankData | null> {
        const http = new HttpManager();
        http.server = netConfig.Server;
        http.token = netConfig.Token;
        http.timeout = netConfig.Timeout;

        const response = await http.getUrl(`tgapp/api/user/invite/searchLeaderboard?rankingType=${rankingType}&token=${netConfig.Token}`);
        if (response.isSucc && response.res.resultCode == NetErrorCode.Success) {
            console.warn("拉新排行榜:", response.res.leaderboard);
            let rankData = new UserRankData();
            //rankData.rankList = response.res.leaderboard.rankList;
            rankData.rankList = [  // 排行榜
                {
                    "ranking": 1, //排名
                    "userID": 57, //用户id
                    "userName": "明翔",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 2,
                    "userID": 5,
                    "userName": "tests",
                    "count": 1
                },
                {
                    "ranking": 3, //排名
                    "userID": 57, //用户id
                    "userName": "明翔3",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 4, //排名
                    "userID": 57, //用户id
                    "userName": "明",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 5, //排名
                    "userID": 57, //用户id
                    "userName": "明翔5",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 6, //排名
                    "userID": 57, //用户id
                    "userName": "明翔6",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 7, //排名
                    "userID": 57, //用户id
                    "userName": "明翔7",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 8, //排名
                    "userID": 57, //用户id
                    "userName": "明翔8",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 9, //排名
                    "userID": 57, //用户id
                    "userName": "明翔9",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 10, //排名
                    "userID": 57, //用户id
                    "userName": "明翔10",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 11, //排名
                    "userID": 57, //用户id
                    "userName": "明翔11",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 11, //排名
                    "userID": 57, //用户id
                    "userName": "明翔11",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 11, //排名
                    "userID": 57, //用户id
                    "userName": "明翔11",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 11, //排名
                    "userID": 57, //用户id
                    "userName": "明翔11",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 11, //排名
                    "userID": 57, //用户id
                    "userName": "明翔11",  //用户名称
                    "count": 10000 //用户金币数量
                },
            ],
            rankData.userRank = response.res.leaderboard.userRank;
            return rankData;
        } else {
            console.error("拉新排行榜异常", response);
            return null;
        }
    }

    /** 财富排版版 */
    export async function getCoinRankData(): Promise<UserRankData | null> {
        const http = new HttpManager();
        http.server = netConfig.Server;
        http.token = netConfig.Token;
        http.timeout = netConfig.Timeout;

        const response = await http.getUrl(`tgapp/api/user/coin/leaderboard?token=${netConfig.Token}`);
        if (response.isSucc && response.res.resultCode == NetErrorCode.Success) {
            console.warn("财富排行版:", response.res.leaderboard);
            let rankData = new UserRankData();
            //rankData.rankList = response.res.leaderboard.rankList;
            rankData.rankList = [  // 排行榜
                {
                    "ranking": 1, //排名
                    "userID": 57, //用户id
                    "userName": "明翔",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 2,
                    "userID": 5,
                    "userName": "tests",
                    "count": 1
                },
                {
                    "ranking": 3, //排名
                    "userID": 57, //用户id
                    "userName": "明翔",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 4, //排名
                    "userID": 57, //用户id
                    "userName": "明翔",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 5, //排名
                    "userID": 57, //用户id
                    "userName": "明翔",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 6, //排名
                    "userID": 57, //用户id
                    "userName": "明翔",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 7, //排名
                    "userID": 57, //用户id
                    "userName": "明翔",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 8, //排名
                    "userID": 57, //用户id
                    "userName": "明翔",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 9, //排名
                    "userID": 57, //用户id
                    "userName": "明翔",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 10, //排名
                    "userID": 57, //用户id
                    "userName": "明翔",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 11, //排名
                    "userID": 57, //用户id
                    "userName": "明翔",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 12, //排名
                    "userID": 57, //用户id
                    "userName": "明翔",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 13, //排名
                    "userID": 57, //用户id
                    "userName": "明翔",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 14, //排名
                    "userID": 57, //用户id
                    "userName": "明翔",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 15, //排名
                    "userID": 57, //用户id
                    "userName": "明翔",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 16, //排名
                    "userID": 57, //用户id
                    "userName": "明翔",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 17, //排名
                    "userID": 57, //用户id
                    "userName": "明翔",  //用户名称
                    "count": 10000 //用户金币数量
                },
            ],
            rankData.userRank = response.res.leaderboard.userRank;
            return rankData;
        } else {
            console.error("财富排行版异常", response);
            return null;
        }
    }
    /** 星兽排行版 */
    export async function getSTBRankData(STBtype: STBType): Promise<UserRankData | null> {
        const http = new HttpManager();
        http.server = netConfig.Server;
        http.token = netConfig.Token;
        http.timeout = netConfig.Timeout;

        const response = await http.getUrl(`tgapp/api/user/stb/leaderboard?stbId=${STBtype}&token=${netConfig.Token}`);
        if (response.isSucc && response.res.resultCode == NetErrorCode.Success) {
            console.warn("星兽排行版:", response.res.leaderboard);
            let rankData = new UserRankData();
            rankData.rankList = response.res.leaderboard.rankList;
            rankData.rankList = [  // 排行榜
                {
                    "ranking": 1, //排名
                    "userID": 57, //用户id
                    "userName": "星兽明翔",  //用户名称
                    "count": 10000 //用户金币数量
                },
                {
                    "ranking": 2,
                    "userID": 5,
                    "userName": "tests",
                    "count": 1
                },
                {
                    "ranking": 3, //排名
                    "userID": 57, //用户id
                    "userName": "明翔星兽",  //用户名称
                    "count": 10000 //用户金币数量
                }
            ]
            //rankData.userRank = response.res.leaderboard.userRank;
            rankData.userRank = {
                "ranking": 1, //排名
                "userID": 57, //用户id
                "userName": "星兽明翔",  //用户名称
                "count": 10000 //用户金币数量
            };
            return rankData;
        } else {
            console.error("星兽排行版异常", response);
            return null;
        }
    }
}