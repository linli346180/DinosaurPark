import { _decorator, Component, Node, Button, Prefab, instantiate } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { UserRankData, RankData, RankGroup, RankType, STBType, RankDataList, } from './RankDefine';
import { RankNetService } from './RankNet';
import { RankItem } from './RankItem';
import { smc } from '../common/SingletonModuleComp';
import { RankToggle } from './RankToggle';
import { Label } from 'cc';
import { ListToggle } from './ListToggle';
import { STBToggle } from './STBToggle';
import { CusScrollList } from '../common/scrollList/CusScrollList';
import { Sprite } from 'cc';
import { Vec3 } from 'cc';
import { UITransform } from 'cc';
import { UICallbacks } from '../../../../extensions/oops-plugin-framework/assets/core/gui/layer/Defines';
import { EvolveTipsView } from '../evolve/EvolveTipsView';
import { assetManager } from 'cc';
import { ImageAsset } from 'cc';
import { Texture2D } from 'cc';
import { SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RankView')
export class RankView extends Component {
    @property(Prefab)
    itemPerfab: Prefab = null!;
    @property(Button)
    btn_close: Button = null!;
    @property(Node)
    container: Node = null!;
    @property(RankItem)
    selfRankItem: RankItem = null!;
    @property(Node)
    rankToggleGroup: Node = null!;
    @property(Node)
    toggleGroup: Node = null!;
    @property(Node)
    STBToggleGroup: Node = null!;
    @property(Node)
    emptyNode: Node = null!;
    @property(Sprite)
    top1: Sprite = null!;
    @property(Sprite)
    top2: Sprite = null!;
    @property(Sprite)
    top3: Sprite = null!;
    @property(Button)
    btn_instruction: Button = null!;
    @property({ type: CusScrollList }) scrollList: CusScrollList;

    private curRankGroup = RankGroup.Rich;
    private curRankType = RankType.day;
    private STBRankType = STBType.primarySTB;
    private rankData: UserRankData | null = null;
    private rankDataList: RankDataList = new RankDataList();

    protected onLoad(): void {
        this.container.removeAllChildren();
        this.btn_close?.node.on(Button.EventType.CLICK, this.closeUI, this);
        this.btn_instruction?.node.on(Button.EventType.CLICK, this.showInstruction, this);
        this.toggleGroup.children.forEach((childNode, index) => {
            let comp = childNode.getComponent(RankToggle);
            if (comp) {
                comp.onToggleSelcted = this.onToggleSelcted.bind(this);
            }
        });
        this.STBToggleGroup.children.forEach((childNode, index) => {
            let comp = childNode.getComponent(STBToggle);
            if (comp) {
                comp.onToggleSelcted = this.onToggleSelctedSTB.bind(this);
            }
        });
        this.rankToggleGroup.children.forEach((childNode, index) => {
            let comp = childNode.getComponent(ListToggle);
            if (comp) {
                comp.onToggleSelcted = this.onToggleSelctedRankGroup.bind(this);
            }
        });
    }
    onEnable() {
        //this.title.string = this.getRankGroupTitle(this.curRankGroup);
        this.rankDataList = new RankDataList();
        this.UpdateRrankData();
    }

    private closeUI() {
        oops.gui.remove(UIID.RankUI, false);
    }

    private showInstruction() {
        const uic: UICallbacks = {
            onAdded: async (node: Node, params: any) => {
                switch (this.curRankGroup) {
                    case RankGroup.Invite:
                        node.getComponent(EvolveTipsView)?.initUI('inviteRank');
                        break;
                    case RankGroup.Rich:
                        node.getComponent(EvolveTipsView)?.initUI('richRank');
                        break;
                    case RankGroup.STB:
                        node.getComponent(EvolveTipsView)?.initUI('stbRank');
                        break;
                }
            }
        };
        const uiArgs: any = {};
        oops.gui.open(UIID.EvolveTips, uiArgs, uic);
    }

    private onToggleSelcted(index: number) {
        if(this.curRankType != index){
            this.curRankType = index;
            this.initUI();
        }
        
    }

    private onToggleSelctedRankGroup(index: number) {
        if(this.curRankGroup != index){
           this.curRankGroup = index;
           this.initUI(); 
        }
        
    }

    private onToggleSelctedSTB(index: number) {
        if(this.STBRankType != index){
            this.STBRankType = index;
            this.initUI();
        } 
    }

    private async UpdateRrankData() {
        this.rankData = await RankNetService.getCoinRankData();
        this.rankDataList.fillData(this.rankData, RankGroup.Rich);
        // this.rankData = await RankNetService.getInviteRankData(0);
        // this.RankDataList.fillData(this.rankData, RankGroup.Invite, RankType.day);
        // this.rankData = await RankNetService.getInviteRankData(1);
        // this.RankDataList.fillData(this.rankData, RankGroup.Invite, RankType.week);
        // this.rankData = await RankNetService.getInviteRankData(2);
        // this.RankDataList.fillData(this.rankData, RankGroup.Invite, RankType.month);
        // this.rankData = await RankNetService.getInviteRankData(0);
        // this.RankDataList.fillData(this.rankData, RankGroup.Invite, null, STBType.primarySTB);
        // this.rankData = await RankNetService.getInviteRankData(1);
        // this.RankDataList.fillData(this.rankData, RankGroup.Invite, null, STBType.intermediateSTB);
        // this.rankData = await RankNetService.getInviteRankData(2);
        // this.RankDataList.fillData(this.rankData, RankGroup.Invite, null, STBType.seniorSTB);
        this.initUI();
    }

    private async initUI() {
        this.container.removeAllChildren();
        this.emptyNode.active = true
        
        if (this.curRankGroup == RankGroup.Invite) {
            switch (this.curRankType) {
                case RankType.day:
                    if(!this.rankDataList.dayInviteRank){
                        this.rankData = await RankNetService.getInviteRankData(this.curRankType);
                        this.rankDataList.fillData(this.rankData, RankGroup.Invite, RankType.day);
                    }
                    this.rankData = this.rankDataList.dayInviteRank;
                    break;
                case RankType.week:
                    if(!this.rankDataList.weekInviteRank){
                        this.rankData = await RankNetService.getInviteRankData(this.curRankType);
                        this.rankDataList.fillData(this.rankData, RankGroup.Invite, RankType.week);
                    }
                    this.rankData = this.rankDataList.weekInviteRank;
                    break;
                case RankType.month:
                    if(!this.rankDataList.monthInviteRank){
                        this.rankData = await RankNetService.getInviteRankData(this.curRankType);
                        this.rankDataList.fillData(this.rankData, RankGroup.Invite, RankType.month);
                    }
                    this.rankData = this.rankDataList.monthInviteRank;
                    break;
            }
            //this.rankData = await RankNetService.getInviteRankData(this.curRankType);
        }
        if (this.curRankGroup == RankGroup.Rich) {
            //this.rankData = await RankNetService.getCoinRankData();
            this.rankData = this.rankDataList.richRank;
        }
        if (this.curRankGroup == RankGroup.STB) {
            switch (this.STBRankType) {
                case STBType.primarySTB:
                    if(!this.rankDataList.primarySTBRank){
                        this.rankData = await RankNetService.getSTBRankData(this.STBRankType);//修改接口
                        this.rankDataList.fillData(this.rankData, RankGroup.Invite, null, STBType.primarySTB);
                    }
                    this.rankData = this.rankDataList.primarySTBRank;
                    break;
                case STBType.intermediateSTB:
                    if(!this.rankDataList.intermediateSTBRank){
                        this.rankData = await RankNetService.getSTBRankData(this.STBRankType);//修改接口
                        this.rankDataList.fillData(this.rankData, RankGroup.Invite, null, STBType.intermediateSTB);
                    }
                    this.rankData = this.rankDataList.intermediateSTBRank;
                    break;
                case STBType.seniorSTB:
                    if(!this.rankDataList.seniorSTBRank){
                        this.rankData = await RankNetService.getSTBRankData(this.STBRankType);
                        this.rankDataList.fillData(this.rankData, RankGroup.Invite, null, STBType.seniorSTB);
                    }
                    this.rankData = this.rankDataList.seniorSTBRank;
                    break;
            }
            //this.rankData = await RankNetService.getInviteRankData(this.STBRankType);
        }
        console.log(this.rankData);
        this.rankData.rankList.forEach((item) => {
            (item as any).curRankType = this.curRankGroup;
            (item as any).STBRankType = this.STBRankType;
        });
        this.rankData.rankList.sort((a, b) => { return a.ranking - b.ranking; });//按排名排序
        //this.top1.spriteFrame = this.rankData.rankList[0].图片属性;
        //this.top2.spriteFrame = await this.loadAvatar("1111");
        //this.top3.spriteFrame = ;
        this.scrollList.setDataList(this.rankData.rankList, 2, [10, 10, 10]);//,this.curRankGroup, this.STBRankType
        this.scrollList.scroll2Index(0);
        this.toggleGroup.active = this.curRankGroup == RankGroup.Invite;
        this.STBToggleGroup.active = this.curRankGroup == RankGroup.STB;
        if (!this.rankData) return;

        if(this.rankData.userRank.userName == '') {
            this.rankData.userRank.userName = smc.account.AccountModel.userData.name;
        }
        this.selfRankItem.initItem(this.rankData.userRank, this.curRankGroup, this.STBRankType);

        this.emptyNode.active = this.rankData.rankList.length == 0;
        // this.rankData.rankList.sort((a, b) => { return a.ranking - b.ranking; });
        // for (const rankItem of this.rankData.rankList) {
        //     let item = instantiate(this.itemPerfab);
        //     if (item) {
        //         item.getComponent(RankItem)?.initItem(rankItem, this.curRankGroup, this.STBRankType);
        //         this.container.addChild(item);
        //     }
        // }
    }

    private loadAvatar(url: string): Promise<SpriteFrame | null> {
        return new Promise((resolve, reject) => {
            // 检查 URL 是否为空
            if (!url || url.length === 0) {
                resolve(null); // 如果 URL 无效，返回 null
                console.warn('url 无效');
                return;
            }
            
            // 加载远程图片资产
            assetManager.loadRemote<ImageAsset>(url, (err, imageAsset) => {
                if (err) {
                    reject(err); // 如果发生错误，拒绝 Promise
                    return;
                }
    
                // 创建新的纹理和精灵帧
                const texture = new Texture2D();
                texture.image = imageAsset;
                const spriteFrame = new SpriteFrame();
                spriteFrame.texture = texture;
    
                resolve(spriteFrame); // 成功后返回创建的精灵帧
            });
        });
    }

    // private onLeftClicked() {
    //     this.setRankGroup(-1);
    // }

    // private onRightClicked() {
    //     this.setRankGroup(1);
    // }

    // private setRankGroup(direction: number) {
    //     const rankGroups = Object.values(RankGroup).filter(value => typeof value === 'number') as number[];
    //     const currentIndex = rankGroups.indexOf(this.curRankGroup);
    //     const nextIndex = (currentIndex + direction + rankGroups.length) % rankGroups.length;
    //     this.curRankGroup = rankGroups[nextIndex];
    //     //this.title.string = this.getRankGroupTitle(this.curRankGroup);
    //     this.initUI();
    // }

    // private setRankGroupList() {
    //     const rankGroups = Object.values(RankGroup).filter(value => typeof value === 'number') as number[];
    //     const currentIndex = rankGroups.indexOf(this.curRankGroup);
    //     this.curRankGroup = rankGroups[currentIndex];
    //     //this.title.string = this.getRankGroupTitle(this.curRankGroup);
    //     this.initUI();
    // }

    // private getRankGroupTitle(rankGroup: RankGroup): string {
    //     switch (rankGroup) {
    //         case RankGroup.Invite:
    //             return oops.language.getLangByID("invite_tips_pullnew");
    //         case RankGroup.Rich:
    //             return oops.language.getLangByID("invite_tips_rick");
    //         // 添加其他 RankGroup 的标题
    //         default:
    //             return "未知榜";
    //     }
    // }

}