import { Label } from 'cc';
import { Sprite } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { EmailReward } from './EmailDefine';
import { TableItemConfig } from '../common/table/TableItemConfig';
import { StringUtil } from '../common/utils/StringUtil';
import { SpriteFrame } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { AtlasUtil } from '../common/AtlasUtil';
const { ccclass, property } = _decorator;

@ccclass('EmailRewardItem')
export class EmailRewardItem extends Component {
    @property(Sprite)
    icon: Sprite = null!;
    @property(Label)
    num: Label = null!;

    initItem(rewardConfig: EmailReward) {    
        this.num.string =  `x${rewardConfig.awardQuantity}`;
        let itemConfig = new TableItemConfig();
        let itemId = StringUtil.combineNumbers(rewardConfig.awardType, rewardConfig.awardResourceId, 2);

        itemConfig.init(itemId);
        if(itemConfig.icon != null && itemConfig.icon != undefined && itemConfig.icon != ''){ 
            // oops.res.loadAsync(itemConfig.icon + '/spriteFrame', SpriteFrame).then((spriteFrame) => {
            //     if (spriteFrame)
            //         this.icon.spriteFrame = spriteFrame;
            // })
            AtlasUtil.loadAtlasAsync(itemConfig.icon).then((spriteFrame) => { 
                if(spriteFrame)
                    this.icon.spriteFrame = spriteFrame;
                else 
                    console.error('加载失败:', itemConfig.icon);
            });
        }

        
    }
}