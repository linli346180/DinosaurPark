import { Label, _decorator, Component, Button, Sprite } from 'cc';
import { StringUtil } from '../common/utils/StringUtil';
import { TableItemConfig } from '../common/table/TableItemConfig';
import { AtlasUtil } from '../common/AtlasUtil';
import { PropConfig } from './ShopDefine';
import { ShopNetService } from './ShopNet';
import { smc } from '../common/SingletonModuleComp';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
const { ccclass, property } = _decorator;

@ccclass('PropShopItem')
export class PropShopItem extends Component {
    @property(Label) duration: Label = null!;
    @property(Label) amount: Label = null!;
    @property(Button) btn_buy: Button = null!;
    @property(Sprite) bigIcon: Sprite = null!;
    @property(Sprite) smallIcon: Sprite = null!;

    public onItemClicked: (configId: number) => void = null!;
    private config: PropConfig = null!;
    private itemConfig = new TableItemConfig();

    onLoad() {
        this.btn_buy.node.on(Button.EventType.CLICK, this.buyProps, this);
    }

    public initItem(config: PropConfig) {
        this.config = config;
        const itemId = StringUtil.combineNumbers(5, parseInt(config.propMultiplier), 2);
        try {
            this.itemConfig.init(itemId);
            AtlasUtil.loadAtlasAsync(this.itemConfig.icon).then((spriteFrame) => {
                this.bigIcon.spriteFrame = spriteFrame;
                this.bigIcon.spriteFrame = spriteFrame;
            });
        } catch (error) {
            console.error('道具配置错误', itemId);
        }
        this.duration.string = this.formatExpireTime(60);
        this.amount.string = `${config.amount}`;
    }

    private async buyProps() {
        // 判断宝石是否足够
        if (smc.account.AccountModel.CoinData.gemsCoin < parseInt(this.config.amount) ) {
            oops.gui.open(UIID.GemShop)
            return
        }
        const res = await ShopNetService.useProps(this.config.id);
        if (res) {
            oops.gui.toast('使用道具成功');
            smc.account.updateCoinData();
        }
    }

    /**
     * 将秒数转换为 00:00:00 格式的字符串
     * @param seconds 总秒数
     * @returns 格式化后的字符串
     */
    formatExpireTime(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
}