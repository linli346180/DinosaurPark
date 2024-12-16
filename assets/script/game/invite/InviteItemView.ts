import { _decorator, Component, Node, Label, Sprite } from 'cc';
import { ScrollListItem } from '../common/scrollList/ScrollListItem';
import { InviteData } from './InviteData';
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
        // this.loadIcon(userIcon);
        // if (inviteData.successInvite == 1) {
        //     this.userIcon.grayscale = true;
        // }
    }

    private loadIcon(url: string) {
        if (!url || url.length === 0) {
            return;
        }
        // assetManager.loadRemote<ImageAsset>(url, (err, imageAsset) => {
        //     if (!err) {
        //         const texture = new Texture2D();
        //         texture.image = imageAsset;
        //         const spriteFrame = new SpriteFrame();
        //         spriteFrame.texture = texture;
        //         this.userIcon.spriteFrame = spriteFrame;
        //     }
        // });
    }
}


