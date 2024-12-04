import { Label } from 'cc';
// import { EditBox } from 'cc';
import { Button } from 'cc';
import { _decorator, Component, Node } from 'cc';
import DropDown from '../common/DropDown/DropDown';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { tonConnect } from './TonConnect';
import { smc } from '../common/SingletonModuleComp';
import { WalletNetService } from './WalletNet';
import { UIID } from '../common/config/GameUIConfig';
import { WithdrawRequest } from './WalletDefine';
import { Editbox } from '../common/Editbox';
const { ccclass, property } = _decorator;

@ccclass('WithdrawWidget')
export class WithdrawWidget extends Component {
    @property({ type: DropDown })
    private DropDown: DropDown = null!;

    @property(Editbox)
    private edit_email: Editbox = null!;
    @property(Editbox)
    private edit_amount: Editbox = null!;

    @property(Button)
    private btn_connect: Button = null!;
    @property(Button)
    private btn_checkemail: Button = null!;
    @property(Button)
    private btn_withdrawal: Button = null!;

    @property(Label)
    private codeLabel: Label = null!;
    @property(Label)
    private handlingFeeLabel: Label = null!;

    @property(Label)
    private label_purse: Label = null!;

    // 设置提现手续费
    private handlingFee: string = '0';
    public set HandlingFee(value: string) {
        console.log(`设置提现手续费: ${value}`);
        this.handlingFee = value;
        this.handlingFeeLabel.string = `${oops.language.getLangByID('tips_withdrawal_handling_fee')}:${value}%`;;
    }

    // 最低提现金额
    private miniWithdraw: string = '0';
    public set MiniWithdraw(value: string) {
        console.log(`设置最低提现金额: ${value}`);
        this.miniWithdraw = value;
        this.edit_amount.placeholderLabel.string = `${oops.language.getLangByID('tips_withdrawal_amount_min')} ${value} USDT`;
    }

    // 验证码发送间隔
    private sendInterval: number = 60;
    private timeoutId: number | null = null;

    onLoad() {
        this.btn_checkemail?.node.on(Button.EventType.CLICK, this.checkEmail, this);
        this.btn_withdrawal?.node.on(Button.EventType.CLICK, this.withdrawal, this);
        this.btn_connect?.node.on(Button.EventType.CLICK, this.connectTonWallet, this);
        this.showPurchase();
    }

    onEnable() {
        this.HandlingFee = this.handlingFee;
        this.MiniWithdraw = this.miniWithdraw;
        tonConnect.onStateChange = this.onConnectStateChange.bind(this);
    }

    /** 获取邮箱验证码 */
    private async checkEmail() {
        const userEmail = smc.account.AccountModel.userData.email;
        if (userEmail && userEmail.trim() !== '') {
            this.btn_checkemail.interactable = false;
            const res = await WalletNetService.sendEmailCode(userEmail);
            if (res) {
                oops.gui.toast(oops.language.getLangByID('tips_emailcode_sentsuccess'));
                this.showInterval();
            }
            this.btn_checkemail.interactable = true;
        } else {
            oops.gui.open(UIID.EmailVerify);
        }
    }

    /** 显示倒计时 */
    private showInterval() {
        this.sendInterval = 60;
        this.btn_checkemail.interactable = false;
        this.codeLabel.string = `${this.sendInterval}s`;
        this.startCountdown();
    }

    private startCountdown() {
        if (this.sendInterval > 0) {
            this.timeoutId = window.setTimeout(() => {
                this.sendInterval--;
                if (this.sendInterval <= 0) {
                    this.btn_checkemail.interactable = true;
                    this.codeLabel.string = oops.language.getLangByID('tips_emailcode_get');
                } else {
                    this.codeLabel.string = `${this.sendInterval}s`;
                    this.startCountdown();
                }
            }, 1000);
        }
    }

    private async withdrawal() {
        const address = tonConnect.walletConfig.address;
        const emailCode = this.edit_email.string.trim();
        const purseType = this.DropDown.selectedIndex;
        const amount = this.edit_amount.string.trim();
        console.log(`提现信息: ${address}, ${emailCode}, ${purseType + 1}, ${amount}`);
        if (address === '') {
            oops.gui.toast(oops.language.getLangByID('tips_Wallet_address_empty'));
            return;
        }
        if (emailCode === '') {
            oops.gui.toast(oops.language.getLangByID('tips_emailcode_empty'));
            return;
        }
        if (amount === '') {
            oops.gui.toast(oops.language.getLangByID('tips_withdrawal_amount_empty'));
            return;
        }
        const parsedAmount = parseFloat(amount);
        let request: WithdrawRequest = {
            verificationCode: emailCode,
            purseUrl: address,
            purseType: purseType + 1,
            withdrawAmount: parsedAmount
        }
        this.btn_withdrawal.interactable = false;
        const res = await WalletNetService.createWithdrawRecord(request);
        if (res) {
            oops.gui.toast(oops.language.getLangByID('tips_withdrawal_success'));
            smc.account.updateCoinData();
        }
        this.btn_withdrawal.interactable = true;
    }

    private onConnectStateChange(isConnected: boolean) {
        // this.edit_address.string = tonConnect.walletConfig.address;
        this.showPurchase();
    }

    private connectTonWallet() {
        tonConnect.connectTonWallet();
    }

    // 限制输入框只能输入小数
    // onAmountChanged(editBox: EditBox) {
    //     editBox.blur();
    //     const input = editBox.string;
    //     const validAmount = /^\d*\.?\d{0,5}$/;
    //     if (!validAmount.test(input)) {
    //         editBox.string = input.slice(0, -1);
    //     }
    //     const sanitizedInput = input.replace(/[^0-9.]/g, '');
    //     if (sanitizedInput !== input) {
    //         editBox.string = sanitizedInput;
    //     }
    //     editBox.focus();
    // }

    private showPurchase() {
        // 获取地址
        const address = tonConnect.walletConfig.address;
        if (tonConnect.IsConnected && address.length > 0) {
            // 格式化地址为前5个字符 + 中间省略号 + 后5个字符
            const formattedAddress = `${address.slice(0, 5)}...${address.slice(-5)}`;
            // 设置标签文本
            this.label_purse.string = formattedAddress;
        } else {
            this.label_purse.string = oops.language.getLangByID('tips_Wallet_address_empty');
        }
    }
}


