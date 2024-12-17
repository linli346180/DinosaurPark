import { _decorator, Component, Label, Sprite, SpriteFrame } from 'cc';
import { RewardConfig, RewardType } from './HatchDefine';
import { TableItemConfig } from '../common/table/TableItemConfig';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { StringUtil } from '../common/utils/StringUtil';
import { AtlasUtil } from '../common/AtlasUtil';
const { ccclass, property } = _decorator;

@ccclass('RewardItem')
export class RewardItem extends Component {
    @property(Sprite) icon: Sprite = null!;
    @property(Label) goodName: Label = null!;

    private itemConfig: TableItemConfig = new TableItemConfig();
    private rewardConfig: RewardConfig = null;

    async initItem(rewardConfig: RewardConfig) {
        this.rewardConfig = rewardConfig;
        const itemId = StringUtil.combineNumbers(rewardConfig.rewardType, rewardConfig.rewardGoodsID, 2);
        try {
            this.itemConfig.init(itemId);
            this.icon.spriteFrame = await AtlasUtil.loadAtlasAsync(this.itemConfig.icon);
        } catch (error) {
            console.error('奖励配置错误', rewardConfig);
        }
        this.updateName();
    }

    private updateName() {
        if (!this.rewardConfig) return;
        if (this.rewardConfig.rewardNum > 1) {
            this.goodName.string = this.rewardConfig.rewardNum.toString();
        } else {
            this.goodName.string = this.getFormattedName();
        }
    }

    private getFormattedName(): string {
        const nameParts = this.itemConfig.name.split("|");
        const baseName = oops.language.getLangByID(nameParts[0]);
        return nameParts.length > 1 ? `${baseName} ${nameParts[1]}` : baseName;
    }
}