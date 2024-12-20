import { _decorator, Component, Node, Button, Label, Toggle, Sprite, assetManager, ImageAsset, Texture2D, SpriteFrame, sys } from 'cc';
import { smc } from '../common/SingletonModuleComp';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { AccountEvent } from '../account/AccountEvent';
import { UIID } from '../common/config/GameUIConfig';
import { AccountNetService } from '../account/AccountNet';
import { tonConnect } from '../wallet/TonConnect';
import { UserConfigData } from './UserConfigDefine';
import { ReddotComp } from '../reddot/ReddotComp';
import { AvatarUtil } from '../common/AvatarUtil';

const { ccclass, property } = _decorator;

@ccclass('usercenter')
export class usercenter extends Component {
    @property(Button) btn_close: Button = null!;
    @property(Sprite) avatar: Sprite = null!;
    @property(Label) label_name: Label = null!;
    @property(Label) label_id: Label = null!;
    @property(Label) label_email: Label = null!;
    @property(Label) label_purse: Label = null!;
    @property(Label) label_language: Label = null!;
    @property(Button) btn_email: Button = null!;
    @property(Button) btn_purse: Button = null!;
    @property(Button) btn_language: Button = null!;
    @property(Button) btn_mailbox: Button = null!;
    @property(Button) btn_introduce: Button = null!;
    @property(Button) btn_guide: Button = null!;
    @property(Button) btn_service: Button = null!;
    @property(Toggle) toggle_music: Toggle = null!;
    @property(Toggle) toggle_sound: Toggle = null!;

    private configData: UserConfigData[] = [];

    onLoad() {
        AccountNetService.getUserConfig('external_link').then((res) => {
            if (res && res.languageConfigArr) {
                this.configData = res.languageConfigArr;
            }
        });

        this.btn_close.node.on(Button.EventType.CLICK, this.closeUI, this);
        this.btn_email.node.on(Button.EventType.CLICK, this.changeEmail, this);
        this.btn_language.node.on(Button.EventType.CLICK, this.changeLanguage, this);
        this.btn_purse?.node.on(Button.EventType.CLICK, this.connectPurse, this);
        this.btn_mailbox?.node.on(Button.EventType.CLICK, this.openMailBox, this);
        this.btn_introduce?.node.on(Button.EventType.CLICK, this.onIntroduce, this);
        this.btn_guide?.node.on(Button.EventType.CLICK, this.onGuide, this);
        this.btn_service?.node.on(Button.EventType.CLICK, this.onService, this);
        this.toggle_music.node.on(Toggle.EventType.TOGGLE, this.onToggleMusic, this);
        this.toggle_sound.node.on(Toggle.EventType.TOGGLE, this.onToggleSound, this);

        oops.message.on(AccountEvent.ChangeEmail, this.initUI, this);
        oops.message.on(AccountEvent.ChangeLanguage, this.initUI, this);
    }

    onEnable() {
        this.initUI();
    }

    onDestroy() {
        oops.message.off(AccountEvent.ChangeEmail, this.initUI, this);
        oops.message.off(AccountEvent.ChangeLanguage, this.initUI, this);
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
        this.loadAvatar();
    }

    private onConnectStateChange(isConnected: boolean) {
        this.showPurchase();
    }

    private loadAvatar() {
        this.avatar.getComponent(AvatarUtil)?.InitAvatar(smc.account.AccountModel.userData.avatarPath);
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
            }
        }
    }

    private redDotReaded(targetNode: Node) {
        targetNode.getComponentInChildren(ReddotComp)?.setRead();
    }

    private showPurchase() {
        this.label_purse.string = tonConnect.TonAddress;
    }
}