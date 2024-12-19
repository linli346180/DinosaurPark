import { Label } from 'cc';
import { Sprite } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { GuideRewardInfo } from './GuideDefine';
import { TableItemConfig } from '../common/table/TableItemConfig';
import { StringUtil } from '../common/utils/StringUtil';
import { SpriteFrame } from 'cc';
import { AtlasUtil } from '../common/AtlasUtil';
const { ccclass, property } = _decorator;

@ccclass('GuideRewardItem')
export class GuideRewardItem extends Component {
    @property(Sprite) icon: Sprite = null!;
    @property(Label) num: Label = null!;

    public initItem(rewardConfig: GuideRewardInfo) {
        this.num.string = `x${StringUtil.formatMoney(rewardConfig.rewardNum)}`;
        let itemConfig = new TableItemConfig();
        let itemId = StringUtil.combineNumbers(rewardConfig.rewardType, rewardConfig.rewardGoodsID, 2);
        try {
            itemConfig.init(itemId);
            if (itemConfig.icon) {
                AtlasUtil.loadAtlasAsync(itemConfig.icon).then((spriteFrame) => {
                    this.icon.spriteFrame = spriteFrame;
                });
            }
        } catch (error) {
            console.error('奖励配置错误:', itemId);
        }
    }
}