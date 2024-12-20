import { _decorator, Component, Node, Button, Prefab, instantiate, Label, Sprite, assetManager, ImageAsset, Texture2D, SpriteFrame } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { UserRankData, RankDataList, RankGroup, RankType, STBType } from './RankDefine';
import { RankNetService } from './RankNet';
import { RankItem } from './RankItem';
import { smc } from '../common/SingletonModuleComp';
import { RankToggle } from './RankToggle';
import { ListToggle } from './ListToggle';
import { STBToggle } from './STBToggle';
import { CusScrollList } from '../common/scrollList/CusScrollList';
import { UICallbacks } from '../../../../extensions/oops-plugin-framework/assets/core/gui/layer/Defines';
import { EvolveTipsView } from '../evolve/EvolveTipsView';
import { AvatarUtil } from '../common/AvatarUtil';

const { ccclass, property } = _decorator;

@ccclass('RankView')
export class RankView extends Component {
    @property(Prefab) itemPerfab: Prefab = null!;
    @property(Button) btn_close: Button = null!;
    @property(Node) container: Node = null!;
    @property(RankItem) selfRankItem: RankItem = null!;
    @property(Node) rankGroup: Node = null!;
    @property(Node) dayGroup: Node = null!;
    @property(Node) stbGroup: Node = null!;

    @property(Node) emptyNode: Node = null!;
    @property(Sprite) top1: Sprite = null!;
    @property(Sprite) top2: Sprite = null!;
    @property(Sprite) top3: Sprite = null!;
    @property(Button) btn_instruction: Button = null!;
    @property({ type: CusScrollList }) scrollList: CusScrollList;

    private curRankGroup = RankGroup.Rich;
    private curRankType = RankType.day;
    private curSTBRankType = STBType.primarySTB;

    private rankData: UserRankData | null = null;
    private rankDataList: RankDataList = new RankDataList();

    protected onLoad(): void {
        this.container.removeAllChildren();
        this.bindEvents();
    }

    onEnable() {
        this.rankDataList = new RankDataList();
        this.onRankGroup(this.curRankGroup);
    }

    private bindEvents() {
        this.btn_close?.node.on(Button.EventType.CLICK, this.closeUI, this);
        this.btn_instruction?.node.on(Button.EventType.CLICK, this.showInstruction, this);

        this.rankGroup.children.forEach((childNode) => {
            const comp = childNode.getComponent(ListToggle);
            if (comp) {
                comp.onToggleSelcted = this.onRankGroup.bind(this);
            }
        });

        this.dayGroup.children.forEach((childNode) => {
            const comp = childNode.getComponent(RankToggle);
            if (comp) {
                comp.onToggleSelcted = this.onDayGroup.bind(this);
            }
        });
        this.stbGroup.children.forEach((childNode) => {
            const comp = childNode.getComponent(STBToggle);
            if (comp) {
                comp.onToggleSelcted = this.onStbGroup.bind(this);
            }
        });
        
    }

    private closeUI() {
        oops.gui.remove(UIID.RankUI, false);
    }

    private showInstruction() {
        const uic: UICallbacks = {
            onAdded: async (node: Node) => {
                const evolveTipsView = node.getComponent(EvolveTipsView);
                if (evolveTipsView) {
                    switch (this.curRankGroup) {
                        case RankGroup.Invite:
                            evolveTipsView.initUI('inviteRank');
                            break;
                        case RankGroup.Rich:
                            evolveTipsView.initUI('richRank');
                            break;
                        case RankGroup.STB:
                            evolveTipsView.initUI('stbRank');
                            break;
                    }
                }
            }
        };
        oops.gui.open(UIID.EvolveTips, {}, uic);
    }

    private onRankGroup(index: number) {
        this.curRankGroup = index;
        this.initUI();
        this.dayGroup.active = this.curRankGroup == RankGroup.Invite;
        this.stbGroup.active = this.curRankGroup == RankGroup.STB;
    }

    private onDayGroup(index: number) {
        this.curRankType = index;
        this.initUI();   
    }

    private onStbGroup(index: number) {
        this.curSTBRankType = index;
        this.initUI();
    }


    private async initUI() {
        this.container.removeAllChildren();
        this.emptyNode.active = true;

        // 本地缓存读取
        this.rankData = this.rankDataList.getRankData(this.curRankGroup, this.curRankType, this.curSTBRankType);
        if (!this.rankData) {
            console.log("本地缓存不存在");

            if (this.curRankGroup === RankGroup.Invite) {
                await this.updateInviteRankData();
            } else if (this.curRankGroup === RankGroup.Rich) {
                await this.updateRankData();
            } else if (this.curRankGroup === RankGroup.STB) {
                await this.updateSTBRankData();
            }
        }

        if (!this.rankData) {
            console.error('排行版数据异常', this.curRankGroup);
            return;
        }

        this.rankData.rankList.forEach((item) => {
            item.curRankType = this.curRankGroup;
            item.STBRankType = this.curSTBRankType;
        });
        this.rankData.rankList.sort((a, b) => a.ranking - b.ranking);
        this.rankData.rankList.forEach((data) => {
            const itemNode = instantiate(this.itemPerfab);
            const rankItem = itemNode.getComponent(RankItem);
            if (rankItem) {
                rankItem.initItem(data, this.curRankGroup, this.curSTBRankType);
                this.container.addChild(itemNode);
            }
        });
        this.selfRankItem.initItem(this.rankData.userRank, this.curRankGroup, this.curSTBRankType);
        this.emptyNode.active = this.rankData.rankList.length === 0;
        await this.updateTop3Avatars();
    }

    private async updateTop3Avatars() {
        const topSprites = [this.top1, this.top2, this.top3];
        const length = Math.min(this.rankData.rankList.length, 3);

        for (let i = 0; i < length; i++) {
            console.log(i);
            topSprites[i].getComponent(AvatarUtil)?.InitAvatar(smc.account.AccountModel.userData.avatarPath);
        }
    }

    // 更新富豪榜数据
    private async updateRankData() {
        const res = await RankNetService.getCoinRankData();
        if (res) {
            this.rankDataList.fillData(res, RankGroup.Rich);
            this.rankData = res;
        }
    }

    // 更新邀请榜数据
    private async updateInviteRankData() {
        const res = await RankNetService.getInviteRankData(this.curRankType);
        if (res) {
            this.rankDataList.fillData(res, RankGroup.Invite, this.curRankType, this.curSTBRankType);
            this.rankData = res;
        }
    }

    // 更新星兽榜数据
    private async updateSTBRankData() {
        const stbConfig = smc.account.getSTBConfigByType(this.curSTBRankType)
        const res = await RankNetService.getSTBRankData(stbConfig.id);
        if (res) {
            this.rankDataList.fillData(this.rankData, RankGroup.STB, this.curRankType, this.curSTBRankType);
            this.rankData = res;
        }
    }
}