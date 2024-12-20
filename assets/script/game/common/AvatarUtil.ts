import { _decorator, Component, Sprite, assetManager, ImageAsset, Texture2D, SpriteFrame } from 'cc';
const { ccclass, requireComponent, property } = _decorator;

@ccclass('AvatarUtil')
@requireComponent(Sprite)
export class AvatarUtil extends Component {
    @property icon: Sprite = null!;
    @property url: string = '';
    @property saveToStorage: boolean = true;   // 是否保存到本地
    @property({readonly: true})
    loadSuccess: boolean = false;   // 是否加载成功(用于判断是否需要保存到本地)

    onLoad() {
        this.icon = this.getComponent(Sprite);
        this.InitAvatar(this.url);
    }

    // 初始化头像
    public InitAvatar(avatarUrl: string) {
        this.url = avatarUrl;
        this.loadAvatar(avatarUrl);
    }

    // 加载头像
    public loadAvatar(url: string) {
        if (url === '') {
            return;
        }

        if (url.includes('api.telegram.org')) {
            this.logError('不支持TG头像:', url);
            return;
        }

        if(this.loadSuccess) {
            console.log("头像已加载成功,无需重复加载");
            return;
        }

        console.log(`【开始加载头像:${url}】`);
        this.loadAvatarFromLocalStorage(url, (imageAsset) => {
            if (imageAsset) {
                this.setAvatarToSprite(imageAsset);
            } else {
                this.loadAvatarFromRemote(url);
            }
            console.log(`【加载完成】`);
        });
    }

    // 从本地加载头像
    private loadAvatarFromLocalStorage(key: string, callback: (imageAsset: ImageAsset | null) => void) {
        const base64Data = localStorage.getItem(key);
        if (!base64Data) {
            console.log("1.本地缓存不存在,等待远程下载");
            callback(null);
            return;
        }

        const img = new Image();
        img.onload = () => {
            console.log("使用本地缓存加载头像:", key);
            const imageAsset = new ImageAsset(img);
            callback(imageAsset);
        };
        img.onerror = () => {
            this.logError('头像本地缓存加载异常:', key);
            callback(null);
        };
        img.src = base64Data;
    }

    // 从远程加载头像
    private loadAvatarFromRemote(url: string) {
        assetManager.loadRemote<ImageAsset>(url, (err, imageAsset) => {
            if (!err) {
                console.log(`2.加载远程头像成功:${url}`);
                this.setAvatarToSprite(imageAsset!);
                if(this.saveToStorage) 
                    this.saveAvatarToLocalStorage(url, url, (success) => {
                        if (success) {  
                            console.log("3.保存到本地缓存:", url);
                        }});
            } else {
                this.logError("加载远程头像失败:", url);
            } 
        });
    }

    // 存储头像到本地
    private saveAvatarToLocalStorage(url: string, key: string, callback: (success: boolean) => void) {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // 允许跨域加载
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0);

            // 转换为 Base64 数据
            const base64Data = canvas.toDataURL('image/png');
            try {
                localStorage.setItem(key, base64Data);
                callback(true);
            } catch (e) {
                this.logError('Failed to save avatar to localStorage:', e);
                callback(false);
            }
        };
        img.onerror = () => {
            this.logError('Failed to load image from URL:', url);
            callback(false);
        };
        img.src = url;
    }

    // 设置头像到 Sprite
    private setAvatarToSprite(imageAsset: ImageAsset) {
        const texture = new Texture2D();
        texture.image = imageAsset;
        const spriteFrame = new SpriteFrame();
        spriteFrame.texture = texture;
        this.icon.spriteFrame = spriteFrame;

        this.loadSuccess = true;
    }

    // 统一错误日志处理
    private logError(message: string, ...optionalParams: any[]) {
        console.error(message, ...optionalParams);
    }
}