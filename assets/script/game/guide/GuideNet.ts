import { _decorator, Component, Node } from 'cc';
import { HttpManager } from '../../net/HttpManager';
import { netConfig } from '../../net/custom/NetConfig';
import { NetErrorCode } from '../../net/custom/NetErrorCode';

export namespace GuideNetService {

    /** 获取预售配置 */
    export async function getPresellData() {
        const http = createHttpManager();
        const response = await http.getUrl(`tgapp/api/presell/getPresell?token=${netConfig.Token}`);
        if (response.isSucc && response.res.resultCode === NetErrorCode.Success) {
            console.warn("获取预售配置:", response.res);
            return response.res;
        } else {
            console.error("获取预售配置异常", response);
            return null;
        }
    }

    /** 查询用户是否加入官方群组或频道 */
    export async function getUserOfficial() {
        const http = createHttpManager();
        const response = await http.getUrl(`tgapp/api/presell/getUserOfficial?token=${netConfig.Token}`);
        if (response.isSucc && response.res.resultCode === NetErrorCode.Success) {
            console.warn("查询用户是否加入官方群组或频道:", response.res);
            return response.res.userOfficial;
        } else {
            console.error("查询用户是否加入官方群组或频道置异常", response);
            return null;
        }
    }

    /** 离开页面时间 */
    export async function getPresellLeave(): Promise<any | null> {
        const http = createHttpManager();
        const response = await http.postUrl(`tgapp/api/presell/leave?leaveType=${1}&token=${netConfig.Token}`);
        if (response.isSucc && response.res.resultCode === NetErrorCode.Success) {
            console.warn("离开页面时间:", response.res);
            return response.res;
        } else {
            console.error("离开页面时间异常", response);
            return null;
        }
    }

    /** 领取新手奖励 */
    export async function getRewardNew() {
        const http = createHttpManager();
        const response = await http.postUrl(`tgapp/api/user/reward/new?token=${netConfig.Token}`);
        if (response.isSucc && response.res.resultCode === NetErrorCode.Success) {
            console.warn("领取新手奖励:", response.res);
            return response.res;
        } else {
            console.error("领取新手奖励异常", response);
            return null;
        }
    }

    /** 创建 HttpManager 实例并进行配置 */
    function createHttpManager(): HttpManager {
        const http = new HttpManager();
        http.server = netConfig.Server;
        http.token = netConfig.Token;
        http.timeout = netConfig.Timeout;
        return http;
    }
}