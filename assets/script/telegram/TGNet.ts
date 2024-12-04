import { Logger } from "../Logger";
import { netConfig } from "../net/custom/NetConfig";
import { TGWebAppInitData } from "./TGDefine";

export namespace TGNetService {

    /** 登录TG账号 */
    export async function GetTelegramAPPData(): Promise<TGWebAppInitData> {
        return new Promise((resolve, reject) => {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://telegram.org/js/telegram-web-app.js';
            script.onload = async () => {
                try {
                    const WebApp = (window as any).Telegram.WebApp;
                    const initDataUnsafe = JSON.stringify(WebApp.initDataUnsafe);
                    if (initDataUnsafe == null || initDataUnsafe == undefined || initDataUnsafe == '') {
                        Logger.logNet('Failed to get initDataUnsafe:', initDataUnsafe);
                        reject(initDataUnsafe);
                    }
                    console.log('TG数据:', WebApp.initDataUnsafe);

                    const parsedData = JSON.parse(initDataUnsafe);
                    if (parsedData) {
                        const TGAppData = new TGWebAppInitData();
                        TGAppData.initData = WebApp.initData;
                        
                        TGAppData.Auth_date = parsedData.auth_date;
                        TGAppData.Hash = parsedData.hash;
                        TGAppData.UserData = parsedData.user;
                        TGAppData.chat_type = parsedData.chat_type;
                        TGAppData.chat_instance = parsedData.chat_instance;

                        // 邀请码数据
                        const paramsString = decodeURIComponent(WebApp.initData);
                        const params = new URLSearchParams(paramsString);
                        let start_param = params.get("start_param") || '';
                        const parts = start_param.split('_');
                        TGAppData.start_param = start_param;
                        TGAppData.inviteSign = parts.length > 0 ? parts[0] : '';
                        TGAppData.inviteType = parts.length > 1 ? parseInt(parts[1]) : 0;

                        // 获取用户头像下载地址
                        const userId: string = TGAppData.UserData.id.toString();
                        let fileId = await getUserProfilePhotos(userId);
                        let fileUrl = await getPhotoFile(fileId);
                        console.log('头像地址1:', fileUrl);
                        console.log('头像地址2:', TGAppData.AvatarUrl);
                        TGAppData.AvatarUrl = fileUrl;
                    
                        resolve(TGAppData);
                    } else {
                        console.error('Failed to get initDataUnsafe:', initDataUnsafe);
                        reject(initDataUnsafe);
                    }
                } catch (error) {
                    console.error('Error during TG login:', error.toString());
                    reject(error);
                }
            };
            script.onerror = (error) => {
                console.error('Failed to load Telegram WebApp script:', error.toString());
                reject(error);
            };
            document.head.appendChild(script);
        });
    }

    /** 获取用户头像 */
    async function getUserProfilePhotos(userId: string) {
        const url = `https://api.telegram.org/bot${netConfig.BotToken}/getUserProfilePhotos?user_id=${userId}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.ok) {
            if (data.result.photos.length > 0) {
                const photo = data.result.photos[0][0];
                return photo.file_id;
            }
        } else {
            Logger.logNet('Failed to get user profile photos:', data.description);
            return '';
        }
    }

    /** 获取头像下载链接 */
    async function getPhotoFile(fileId: string) {
        const url = `https://api.telegram.org/bot${netConfig.BotToken}/getFile?file_id=${fileId}`
        const response = await fetch(url);
        const data = await response.json();
        if (data.ok) {
            const filePath = data.result.file_path;
            const fileUrl = `https://api.telegram.org/file/bot${netConfig.BotToken}/${filePath}`;
            return fileUrl;
        } else {
            Logger.logNet('Failed to get File:', data.description);
            return '';
        }
    }


}