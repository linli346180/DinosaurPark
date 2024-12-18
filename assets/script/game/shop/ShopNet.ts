import { HttpManager } from "../../net/HttpManager";
import { netConfig } from "../../net/custom/NetConfig";
import { NetErrorCode } from "../../net/custom/NetErrorCode";

export namespace ShopNetService {
    /** 获取道具商店道具 */
    export async function getPropsData() {
        const http = new HttpManager();
        const response = await http.getUrl(`tgapp/api/props/getProps?token=${netConfig.Token}`);
        if (response.isSucc && response.res.resultCode == NetErrorCode.Success) {
            console.warn("获取道具商店道具:", response.res);
            return response.res;
        } else {
            console.error("获取道具商店道具异常", response);
            return null;
        }
    }

    /** 获取免费道具 */
    export async function getFreePropsData() {
        const http = new HttpManager();
        const response = await http.getUrl(`tgapp/api/props/getFreeProps?token=${netConfig.Token}`);
        if (response.isSucc && response.res.resultCode == NetErrorCode.Success) {
            console.warn("获取免费道具:", response.res);
            return response.res;
        } else {
            console.error("获取免费道具异常", response);
            return null;
        }
    }

    /** 使用道具 */
    export async function useProps(propId: number) { 
        const http = new HttpManager();
        const response = await http.getUrl(`tgapp/api/props/useProps?token=${netConfig.Token}&id=${propId}`);
        if (response.isSucc && response.res.resultCode == NetErrorCode.Success) {
            console.warn("使用道具:", response.res);
            return response.res;
        } else {
            console.error("使用道具异常", response);
            return null;
        }
    }
}