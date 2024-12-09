import { _decorator, Component, Node } from 'cc';
import { HttpManager } from '../../net/HttpManager';
import { netConfig } from '../../net/custom/NetConfig';
import { NetErrorCode } from '../../net/custom/NetErrorCode';

export namespace CoinNetService {
    /** 获取用户货币数据 */
    export async function getUserCoinData() {
        const http = createHttpManager();
        const response = await http.getUrl("tgapp/api/user/coin?token=" + netConfig.Token);
        if (response.isSucc && response.res.resultCode == NetErrorCode.Success && response.res.userCoin != null) {
            console.warn("货币数据请求成功", response.res);
            return response.res;
        } else {
            console.error("货币数据请求异常", response);
            return null;
        }
    }

    /** 离线收集货币配置 */
    export async function getCollectCoinData() {
        const http = createHttpManager();
        const rescoin = await http.getUrl("tgapp/api/stb/ol/coin/cg?token=" + netConfig.Token);
        if (rescoin.isSucc && rescoin.res.resultCode == NetErrorCode.Success && rescoin.res.offlineCoinConfig != null) {
            console.warn("离线收集货币配置", rescoin.res);
            return rescoin.res;
        } else {
            console.error("离线收集货币配置请求异常", rescoin);
            return null;
        }
    }

    /** 用户是否领取金币池1.是；2.否；免费返回2；支付宝石返回1 */
    export async function collectCoinPool(isPay: number) {
        const http = createHttpManager();
        const params = {
            'isPay': isPay.toString()
        };
        const paramString = new URLSearchParams(params).toString();
        const rescoinpool = await http.postUrl("tgapp/api/user/coin/pool?token=" + netConfig.Token, paramString);
        if (rescoinpool.isSucc && rescoinpool.res.resultCode == NetErrorCode.Success) {
            console.warn("获取金币池请求成功", rescoinpool.res);
            return rescoinpool.res;
        } else {
            console.error("获取金币池请求异常", rescoinpool);
            return null;
        }
    }

    /** 领取用户金币收益 */
    export async function UseCollectCoin() {
        const http = createHttpManager();
        const response = await http.postUrl("tgapp/api/user/goldc/receive?token=" + netConfig.Token);
        if (response.isSucc && response.res.resultCode == NetErrorCode.Success) {
            console.warn("点击领取金币:", response.res);
            return response.res;
        } else {
            console.error("领取金币异常:", response);
            return null;
        }
    }

    /** 领取用户宝石收益 */
    export async function UseCollectGem() {
        const http = createHttpManager();

        const response = await http.postUrl("tgapp/api/user/gemsc/receive?token=" + netConfig.Token);
        if (response.isSucc && response.res.resultCode == NetErrorCode.Success) {
            console.warn("点击领取宝石:", response.res);
            return response.res;
        } else {
            console.error("领取宝石异常", response);
            return null;
        }
    }

    /** 购买宝石配置 */
    export async function getBugGemConfig() {
        const http = createHttpManager();
        const response = await http.getUrl(`tgapp/api/user/buy/gems/config?token=${netConfig.Token}`);
        if (response.isSucc && response.res.resultCode == NetErrorCode.Success) {
            console.warn(`获取购买宝石配置:`, response.res);
            return response.res;
        } else {
            console.error("获取购买宝石配置异常", response);
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


