import { _decorator, Component, Node, Label, Sprite, assetManager, ImageAsset, Texture2D, SpriteFrame } from 'cc';
import { RankData, RankGroup, STBType } from './RankDefine';
import { StringUtil } from '../common/utils/StringUtil';
import { ScrollListItem } from '../common/scrollList/ScrollListItem';
const { ccclass, property } = _decorator;

@ccclass('RankItem')
export class RankItem extends ScrollListItem {
    @property(Node) rankIcon: Node = null!;
    @property(Node) level1: Node = null!;
    @property(Node) level2: Node = null!;
    @property(Node) level3: Node = null!;
    @property(Sprite) rankAc: Sprite = null!;
    @property(Label) rankNum: Label = null!;
    @property(Label) userName: Label = null!;
    @property(Label) inviteCount: Label = null!;
    @property(Node) inviteIcon: Node = null!;
    @property(Node) richIcon: Node = null!;
    @property(Node) STBIcon: Node = null!;
    @property(Node) primarySTB: Node = null!;
    @property(Node) intermediateSTB: Node = null!;
    @property(Node) seniorSTB: Node = null!;

    onItemRender(data: any, ...param: any[]): void {
        this.initItem(data, data.curRankType, data.STBRankType);
    }

    initItem(data: RankData, rankGroup: RankGroup, STBtype: STBType) {
        if (!data) return;

        this.userName.string = data.userName;
        this.inviteCount.string = StringUtil.formatMoney(data.count, 2).toString();
        this.updateIcons(rankGroup, STBtype);
        this.updateRankingDisplay(Math.floor(data.ranking));
    }

    /**
     * 更新图标显示
     * @param rankGroup 排行组
     * @param STBtype STB类型
     */
    private updateIcons(rankGroup: RankGroup, STBtype: STBType) {
        this.inviteIcon.active = rankGroup === RankGroup.Invite;
        this.richIcon.active = rankGroup === RankGroup.Rich;
        this.STBIcon.active = rankGroup === RankGroup.STB;
        this.primarySTB.active = STBtype === STBType.primarySTB;
        this.intermediateSTB.active = STBtype === STBType.intermediateSTB;
        this.seniorSTB.active = STBtype === STBType.seniorSTB;
    }

    /**
     * 更新排名显示
     * @param ranking 排名
     */
    private updateRankingDisplay(ranking: number) {
        const isTopThree = ranking > 0 && ranking <= 3;
        this.rankIcon.active = isTopThree;
        this.rankNum.string = isTopThree ? '' : ranking > 3 ? ranking.toString() : '99+';

        this.level1.active = ranking === 1;
        this.level2.active = ranking === 2;
        this.level3.active = ranking === 3;
    }

    /**
     * 加载头像
     * @param url 头像URL
     */
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