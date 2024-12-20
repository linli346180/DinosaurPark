import { _decorator, Component, Node, Label, Sprite } from 'cc';
import { ScrollListItem } from '../common/scrollList/ScrollListItem';
import { InviteData } from './InviteData';
import { AvatarUtil } from '../common/AvatarUtil';
import { smc } from '../common/SingletonModuleComp';
const { ccclass, property } = _decorator;

@ccclass('InviteItemView')
export class InviteItemView extends ScrollListItem {
    @property(Sprite) userIcon: Sprite = null!;
    @property(Label) userName: Label = null!;
    @property(Node) success: Node = null!;
    @property(Node) unsuccess: Node = null!;

    onItemRender(data: any, ...param: any[]): void {
        console.log("InviteItemView onItemRender data:", data);
        this.initItem(data);
    }

    private initItem(inviteData: InviteData) {
        this.userName.string = inviteData.inviteeUserName;
        this.success.active = inviteData.successInvite == 2;
        this.unsuccess.active = inviteData.successInvite == 1;
        this.userIcon.getComponent(AvatarUtil)?.InitAvatar(smc.account.AccountModel.userData.avatarPath);
    }
}


