import { _decorator, Component, Node, Button, Label, Toggle, Sprite, assetManager, ImageAsset, Texture2D, SpriteFrame } from 'cc';
import { smc } from '../common/SingletonModuleComp';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { AccountEvent } from '../account/AccountEvent';
import { UIID } from '../common/config/GameUIConfig';
import { AccountNetService } from '../account/AccountNet';
import { tonConnect } from '../wallet/TonConnect';
import { sys } from 'cc';
import { UserConfigData } from './UserConfigDefine';
import { ReddotComp } from '../reddot/ReddotComp';

const { ccclass, property } = _decorator;

@ccclass('usercenter')
export class usercenter extends Component {
    @property(Button)
    private btn_clsoe: Button = null!;

    @property(Sprite)
    private avatar: Sprite = null!;
    @property(Label)
    private label_name: Label = null!;
    @property(Label)
    private label_id: Label = null!;
    @property(Label)
    private label_email: Label = null!;
    @property(Label)
    private label_purse: Label = null!;
    @property(Label)
    private label_language: Label = null!;

    @property(Button)
    private btn_email: Button = null!;
    @property(Button)
    private btn_purse: Button = null!;
    @property(Button)
    private btn_language: Button = null!;
    @property(Button)
    private btn_mailbox: Button = null!;
    @property(Button)
    private btn_introduce: Button = null!;
    @property(Button)
    private btn_guide: Button = null!;
    @property(Button)
    private btn_service: Button = null!;

    @property(Toggle)
    private toggle_music: Toggle = null!;
    @property(Toggle)
    private toggle_sound: Toggle = null!;

    private configData: UserConfigData[] = [];

    onLoad() {
        AccountNetService.getUserConfig('external_link').then((res) => {
            if (res && res.languageConfigArr) {
                this.configData = res.languageConfigArr;
            }
        });

        this.btn_clsoe.node.on(Button.EventType.CLICK, this.closeUI, this);
        this.btn_email.node.on(Button.EventType.CLICK, this.changeEmail, this);
        this.btn_language.node.on(Button.EventType.CLICK, this.changeLanguage, this);
        this.btn_purse?.node.on(Button.EventType.CLICK, this.connectPurse, this);
        this.btn_mailbox?.node.on(Button.EventType.CLICK, this.openMailBox, this);
        this.btn_introduce?.node.on(Button.EventType.CLICK, this.onIntroduce, this);
        this.btn_guide?.node.on(Button.EventType.CLICK, this.onGuide, this);
        this.btn_service?.node.on(Button.EventType.CLICK, this.onService, this);
        this.toggle_music.node.on(Toggle.EventType.TOGGLE, this.onToggleMusic, this);
        this.toggle_sound.node.on(Toggle.EventType.TOGGLE, this.onToggleSound, this);

        oops.message.on(AccountEvent.ChangeEmail, this.onHandler, this);
        oops.message.on(AccountEvent.ChangeLanguage, this.onHandler, this);
    }

    onEnable() {
        this.initUI();
    }

    protected onDestroy(): void {
        oops.message.off(AccountEvent.ChangeEmail, this.onHandler, this);
        oops.message.off(AccountEvent.ChangeLanguage, this.onHandler, this);
    }

    private initUI() {
        const userData = smc.account.AccountModel.userData;
        this.label_id.string = userData.id.toString();
        this.label_name.string = userData.name;
        this.label_email.string = userData.email;
        this.toggle_music.isChecked = oops.audio.switchMusic;
        this.toggle_sound.isChecked = oops.audio.switchEffect;
        this.label_language.string = oops.language.languageNames[oops.language.current];
        this.label_email.string = smc.account.AccountModel.userData.email;
        tonConnect.onStateChange = this.onConnectStateChange.bind(this);
        this.showPurchase();

        // TODO 头像需要上传到服务器
        // const url = userData.avatarPath;
        // this.loadAvatar(url, this.avatar);
    }

    private onConnectStateChange(isConnected: boolean) {
        this.showPurchase();
    }

    private loadAvatar(url: string, icon: Sprite) {
        if (!url || url.length === 0) {
            console.error('Failed to load avatar: url is empty');
            return;
        }

        // try {
        //     assetManager.loadRemote<ImageAsset>(url, (err, imageAsset) => {
        //         if (!err) {
        //             const texture = new Texture2D();
        //             texture.image = imageAsset;
        //             const spriteFrame = new SpriteFrame();
        //             spriteFrame.texture = texture;
        //             icon.spriteFrame = spriteFrame;
        //         }
        //     });
        // } catch (error) {
        //     console.error('Failed to load avatar:', error);
        // }
    }

    private onHandler(event: string, args: any) {
        switch (event) {
            case AccountEvent.ChangeEmail:
            case AccountEvent.ChangeLanguage:
                this.initUI();
                break;
        }
    }

    private changeEmail() {
        oops.gui.open(UIID.EmailVerify);
    }

    private changeLanguage() {
        oops.gui.open(UIID.LanguageUI);
    }

    private closeUI() {
        oops.gui.remove(UIID.User, false);
    }

    private connectPurse() {
        tonConnect.connectTonWallet();
    }

    private openMailBox() {
        oops.gui.open(UIID.Email);
        this.closeUI();
        this.redDotReaded(this.btn_mailbox.node);
    }

    private onIntroduce() {
        const url = 'https://explanation.starbeastpark.com';
        window.open(url);
    }

    private onGuide() {
        // 初始化引导模块
        smc.guide.startGuide();
        this.closeUI();
    }

    private onService() {
        const serviceKey = `customer_service${Math.floor(Math.random() * 2) + 1}`;
        console.log("serviceKey", serviceKey)
        this.customerService(serviceKey);
    }

    private onToggleMusic(toggle: Toggle) {
        oops.audio.switchMusic = toggle.isChecked;
        oops.audio.save();
        if (toggle.isChecked) {
            oops.audio.playMusicLoop("audios/nocturne");
        } else {
            oops.audio.stopMusic();
        }
    }

    private onToggleSound(toggle: Toggle) {
        oops.audio.switchEffect = toggle.isChecked;
        oops.audio.save();
    }


    private customerService(kye: string) {
        for (const item of this.configData) {
            if (item.languageKey === kye) {
                window.open(item.description);
                if (sys.platform == 'DESKTOP_BROWSER') {
                    // const WebApp = (window as any).Telegram.WebApp;
                    // WebApp.openLink(item.description);
                }
            }
        }
    }

    private redDotReaded(targetNode: Node) {
        targetNode.getComponentInChildren(ReddotComp)?.setRead();
    }

    private showPurchase() {
        const address = tonConnect.TonAddress;
        if (tonConnect.IsConnected && address.length > 0) {
            const formattedAddress = `${address.slice(0, 5)}...${address.slice(-5)}`;
            this.label_purse.string = formattedAddress;
        }
    }
}