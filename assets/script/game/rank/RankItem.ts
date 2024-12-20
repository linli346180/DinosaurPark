import { _decorator, Component, Node, Label, Sprite, assetManager, ImageAsset, Texture2D, SpriteFrame } from 'cc';
import { RankData, RankGroup, STBType } from './RankDefine';
import { StringUtil } from '../common/utils/StringUtil';
import { ScrollListItem } from '../common/scrollList/ScrollListItem';
import { AvatarUtil } from '../common/AvatarUtil';
import { smc } from '../common/SingletonModuleComp';
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
        if(data.count < 1){
            const num = Number(data.count);
            this.inviteCount.string = num.toFixed(4).toString();
        }else{
            this.inviteCount.string = StringUtil.formatMoney(data.count, 2).toString();
        }
        console.log(data.count);
        this.rankAc.getComponent(AvatarUtil)?.InitAvatar(data.avatarPath);
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
}