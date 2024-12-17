import { HttpManager } from '../../net/HttpManager';
import { netConfig } from '../../net/custom/NetConfig';
import { NetErrorCode } from '../../net/custom/NetErrorCode';

export namespace HatchNetService {
    /** 获取孵化基础信息 */
    export async function getHatchBaseInfo() {
        const http = new HttpManager();
        const response = await http.getUrl(`tgapp/api/user/hatch/info?token=${netConfig.Token}`);
        if (response.isSucc && response.res.resultCode == NetErrorCode.Success) {
            console.warn("获取孵化基础信息:", response.res);
            return response.res
        } else {
            console.error("获取孵化基础信息请求异常", response);
            return null;
        }
    }

    /** 用户孵化 */
    export async function requestUserHatch(hatchNum: number) {
        const http = new HttpManager();
        const response = await http.postUrl(`tgapp/api/user/hatch/userHatchNew?hatchNum=${hatchNum}&token=${netConfig.Token}`);
        if (response.isSucc && response.res.resultCode == NetErrorCode.Success) {
            console.warn(`用户孵化请求成功${hatchNum}:`, response.res);
            return response.res;
        } else {
            console.error(`用户孵化请求异常${hatchNum}`, response);
            return null;
        }
    }
}
