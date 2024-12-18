import { _decorator, Component, Button, Node, Prefab, instantiate } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { PropShopItem } from './PropShopItem';
import { ShopNetService } from './ShopNet';
import { PropConfig } from './ShopDefine';

const { ccclass, property } = _decorator;

/** 道具商店 */
@ccclass('PropShop')
export class PropShop extends Component {
    @property(Button) btn_close: Button = null!;
    @property(Node) itemContent: Node = null!;
    @property(Prefab) itemPrefab: Prefab = null!;
    private propConfig: PropConfig[] = [];

    onLoad() {
        this.btn_close.node.on(Button.EventType.CLICK, this.onClose, this);
        this.initUI();
    }

    private onClose() {
        oops.gui.remove(UIID.PropShop, false);
    }

    /** 初始化购买选项 */
    private async initUI() {
        this.propConfig = [];
        this.itemContent.removeAllChildren();
        const res = await ShopNetService.getPropsShopData();
        if (res && res.props) {
            this.propConfig = res.props;
            this.propConfig.sort((a, b) => a.id - b.id);
            for (const prop of this.propConfig) {
                this.createItem(prop);
            }
        }
    }

    private createItem(config: PropConfig) {
        const itemNode = instantiate(this.itemPrefab);
        if (itemNode) {
            this.itemContent.addChild(itemNode);
            const comp = itemNode.getComponent(PropShopItem);
            if (comp) {
                comp.initItem(config);
            }
        }
    }
}