import { _decorator, Component, Node, Label } from 'cc';
import { RankData, RankGroup, STBType } from './RankDefine';
import { StringUtil } from '../common/utils/StringUtil';
import { Sprite } from 'cc';
import { ScrollListItem } from '../common/scrollList/ScrollListItem';
const { ccclass, property } = _decorator;

@ccclass('RankItem')
export class RankItem extends ScrollListItem {
    @property(Node)
    rankIcon: Node = null!;
    @property(Node)
    level1: Node = null!;
    @property(Node)
    level2: Node = null!;
    @property(Node)
    level3: Node = null!;

    @property(Sprite)
    rankAc: Sprite = null!;
    @property(Label)
    rankNum: Label = null!;
    @property(Label)
    userName: Label = null!;
    @property(Label)
    inviteCount: Label = null!;

    @property(Node)
    inviteIcon: Node = null!;
    @property(Node)
    richIcon: Node = null!;
    @property(Node)
    STBIcon: Node = null!;
    @property(Node)
    primarySTB: Node = null!;
    @property(Node)
    intermediateSTB: Node = null!;
    @property(Node)
    seniorSTB: Node = null!;

    onItemRender(data: any, ...param: any[]): void {
        //console.log("InviteItemView onItemRender data:", data);
        this.initItem(data, data.curRankType, data.STBRankType);
    }

    initItem(data: RankData, rankGroup: RankGroup,STBtype:STBType) {
        // console.log('排行榜数据:', data);
        if (!data) return;

        this.userName.string = data.userName;
        this.inviteCount.string =  StringUtil.formatMoney(data.count,2).toString();
        this.inviteIcon.active = rankGroup === RankGroup.Invite;
        this.richIcon.active = rankGroup === RankGroup.Rich;
        this.STBIcon.active = rankGroup === RankGroup.STB;
        this.primarySTB.active = STBtype === STBType.primarySTB;
        this.intermediateSTB.active = STBtype === STBType.intermediateSTB;
        this.seniorSTB.active = STBtype === STBType.seniorSTB;
        //this.rankAc.spriteFrame = ;//设置头像
        // this.loadAvatar(获取头像URL);
        this.updateRankingDisplay(Math.floor(data.ranking));
    }

    

    private updateRankingDisplay(ranking: number) {
        const isTopThree = ranking > 0 && ranking <= 3;
        this.rankIcon.active = isTopThree;
        this.rankNum.string = isTopThree ? '' : ranking > 3 ? ranking.toString() : '99+';

        this.level1.active = ranking === 1;
        this.level2.active = ranking === 2;
        this.level3.active = ranking === 3;
    }

    private loadAvatar(url: string) {
        if (!url || url.length === 0) {
            return;
        }
        // assetManager.loadRemote<ImageAsset>(url, (err, imageAsset) => {
        //     if (!err) {
        //         const texture = new Texture2D();
        //         texture.image = imageAsset;
        //         const spriteFrame = new SpriteFrame();
        //         spriteFrame.texture = texture;
        //         this.rankAc.spriteFrame = spriteFrame;
        //     }
        // });
    }
}