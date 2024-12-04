import { Logger } from '../../Logger';
import { HttpManager } from '../../net/HttpManager';
import { netConfig } from '../../net/custom/NetConfig';
import { NetErrorCode } from '../../net/custom/NetErrorCode';

export namespace ReviveNetService {

    /** 获取拼图配置 */
    export async function getDebrisConfig() {
        const http = new HttpManager();
        http.server = netConfig.Server;
        http.token = netConfig.Token;
        http.timeout = netConfig.Timeout;

        const response = await http.getUrl("tgapp/api/debris?token=" + netConfig.Token);
        if (response.isSucc && response.res.resultCode == NetErrorCode.Success) {
            console.warn("拼图配置请求成功:", response.res);
            return response.res;
        } else {
            console.error("拼图配置请求异常", response);
            return null;
        }
    }

    /** 获取用户拼图碎片数据 */
    export async function getUserDebrisData() {
        const http = new HttpManager();
        http.server = netConfig.Server;
        http.token = netConfig.Token;
        http.timeout = netConfig.Timeout;

        console.log("请求用户拼图碎片数据");
        const response = await http.getUrl("tgapp/api/user/debris?token=" + netConfig.Token);
        if (response.isSucc && response.res.resultCode == NetErrorCode.Success) {
            console.warn("用户拼图碎片数据请求成功:", response.res);
            return response.res;
        } else {
            console.error("用户拼图碎片数据请求异常", response);
            return null;
        }
    }

    /** 用户拼图碎片合成*/
    export async function clampDebris(debrisID: number) {
        const http = new HttpManager();
        http.server = netConfig.Server;
        http.token = netConfig.Token;
        http.timeout = netConfig.Timeout;

        const params = {
            'debrisID': debrisID.toString()
        };
        const newParams = new URLSearchParams(params).toString();
        const response = await http.postUrl("tgapp/api/user/debris/synth?token=" + netConfig.Token, newParams);
        if (response.isSucc && response.res.resultCode == NetErrorCode.Success) {
            console.warn("拼图碎片合成请求成功:", response.res);
            return response.res;
        } else {
            console.error("拼图碎片合成", response);
            return null;
        }
    }

}
