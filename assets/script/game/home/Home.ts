import { _decorator, Component, Node, Button, Animation, tween, UIOpacity, Vec3, easing } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { AccountEvent } from '../account/AccountEvent';
import { KnapsackControlle } from './KnapsackControlle';
import { KnapsackSlot } from './KnapsackSlot';
import { UserCoinView } from './UserCoinView';
import { AccountCoinType } from '../account/AccountDefine';
import { Label } from 'cc';
import { AnimUtil } from '../common/utils/AnimUtil';
import { smc } from '../common/SingletonModuleComp';
import { RedDotCmd } from '../reddot/ReddotDefine';
import { ReddotComp } from '../reddot/ReddotComp';
import { CollectInfo } from '../collectcoin/CollectDefine';
import { instantiate } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('HomeView')
export class HomeView extends Component {
    @property(Button) btn_user: Button = null!;
    @property(Button) btn_email: Button = null!;
    @property(Button) btn_task: Button = null!;
    @property(Button) btn_rank: Button = null!;
    @property(Button) btn_book: Button = null!;
    @property(Button) btn_revivei: Button = null!;
    @property(Button) btn_store: Button = null!;
    @property(Button) btn_hatch: Button = null!;
    @property(Button) btn_invite: Button = null!;
    @property(Button) btn_activity: Button = null!;
    @property(Node) goldAnimNode: Node = null!;
    @property(Node) goldAnimEndNode: Node = null!;
    @property(Node) usdtAnimNode: Node = null!;
    @property(Label) usdtCount: Label = null!;
    @property(Node) usdtAnimEndNode: Node = null!;
    @property(Node) evolveTips: Node = null!;
    @property(UserCoinView) userCoinView: UserCoinView = null!;

    private buttonMap: { [key: string]: Button } = {};

    start() {
        // oops.audio.playMusicLoop("audios/nocturne");
        this.initializeButtonMap();
        this.addEventListeners();
        oops.message.on(AccountEvent.EvolveUnIncomeSTB, this.onHandler, this);
        oops.message.on(AccountEvent.UserCollectGold, this.onHandler, this);
        oops.message.on(AccountEvent.UserBounsUSTD, this.onHandler, this);
    }

    onDestroy() {
        oops.message.off(AccountEvent.EvolveUnIncomeSTB, this.onHandler, this);
        oops.message.off(AccountEvent.UserCollectGold, this.onHandler, this);
        oops.message.off(AccountEvent.UserBounsUSTD, this.onHandler, this);
    }

    private initializeButtonMap() {
        this.buttonMap = {
            [UIID.User]: this.btn_user,
            [UIID.Email]: this.btn_email,
            [UIID.Task]: this.btn_task,
            [UIID.RankUI]: this.btn_rank,
            [UIID.Book]: this.btn_book,
            [UIID.Revive]: this.btn_revivei,
            [UIID.STBShop]: this.btn_store,
            [UIID.Hatch]: this.btn_hatch,
            [UIID.Invite]: this.btn_invite,
            [UIID.Activity]: this.btn_activity,
        };
    }

    private addEventListeners() {
        for (const key in this.buttonMap) {
            const button = this.buttonMap[key];
            button?.node.on(Button.EventType.CLICK, () => { this.OpenUI(key as unknown as UIID) }, this);
        }
    }

    private removeEventListeners() {
        for (const key in this.buttonMap) {
            const button = this.buttonMap[key];
            button?.node.off(Button.EventType.CLICK, () => { this.OpenUI(key as unknown as UIID) }, this);
        }
    }

    private OpenUI(uid: UIID) {
        const targetNode = this.buttonMap[uid]?.node;
        if (uid == UIID.User) {
            targetNode.getComponentInChildren(ReddotComp)?.setRead(false);
        } else {
            targetNode.getComponentInChildren(ReddotComp)?.setRead();
        }
        oops.gui.open(uid);
    }

    private onHandler(event: string, args: any) {
        switch (event) {
            case AccountEvent.UserCollectGold:
                console.log("收集金币", args);
                const info: CollectInfo = JSON.parse(args);
                if (info) {
                    this.showGoldAnim(info.startPos);
                }

                break;
            case AccountEvent.EvolveUnIncomeSTB:
                this.showStartAnim(args);
                break;
            case AccountEvent.UserBounsUSTD:
                this.showUSTDAnim(args as number);
                break;
        }
    }

    /** 显示金币收集动画 */
    private showGoldAnim(startPos: Vec3) {
        if (!this.goldAnimNode) {
            console.error("金币动画节点不存在");
            return;
        }

        const targetNode = instantiate(this.goldAnimNode);
        this.node.addChild(targetNode);
        targetNode.setWorldPosition(startPos);
        const anim = targetNode.getComponent(Animation);
        const uiOpacity = targetNode.getComponent(UIOpacity);
        if (!anim || !uiOpacity) {
            console.error("金币动画组件不存在");
            return
        }

        tween(targetNode)
            .call(() => { uiOpacity.opacity = 255; anim.play(); })
            .delay(0.5)
            .to(1, { worldPosition: this.goldAnimEndNode.worldPosition })
            .call(() => { targetNode.destroy(); })
            .start();
    }

    private showUSTDAnim(count: number = 0) {
        this.usdtCount.string = "+" + count;
        AnimUtil.playAnim_Move_Opacity(this.usdtAnimNode, this.usdtAnimEndNode.worldPosition, () => {
            smc.account.updateCoinData();
        });
    }

    private showStartAnim(stbId: number) {
        // oops.gui.toast("星兽进化成功");
        const endPos = this.btn_book.node.worldPosition;
        for (const slotNode of KnapsackControlle.instance.SlotNodes) {
            const slotComp = slotNode.getComponent<KnapsackSlot>(KnapsackSlot);
            if (slotComp && slotComp.STBId == stbId) {
                // 背包播放升级动画
                slotComp.showLevelUpAnim(true, () => {
                    oops.message.dispatchEvent(AccountEvent.DelUnIncomeSTB, stbId);
                });
                this.evolveTips.worldPosition = slotComp.node.worldPosition;
                AnimUtil.playAnim_Move_Opacity(this.evolveTips, endPos, () => {
                    console.log("播放完毕", RedDotCmd.StbBookType);
                    oops.message.dispatchEvent(AccountEvent.RedDotCmd, RedDotCmd.StbBookType);
                });
                return;
            }
        }
    }
}