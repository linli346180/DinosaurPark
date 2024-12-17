import { _decorator, Component, Button, Label, Node, Prefab, instantiate } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { AccountNetService } from '../account/AccountNet';
import { smc } from '../common/SingletonModuleComp';
import { AccountEvent } from '../account/AccountEvent';
import { BuyGemsConfig } from './MergeDefine';//要修改为道具商品信息

import { UICallbacks } from '../../../../extensions/oops-plugin-framework/assets/core/gui/layer/Defines';
import { WalletPaySelect } from '../wallet/WalletPaySelect';
import { PropShopItem } from './PropShopItem';

const { ccclass, property } = _decorator;

/** 道具商店 */
@ccclass('PropShop')
export class PropShop extends Component {
    @property(Button)
    private btn_close: Button = null!;

    @property({ type: Node })
    private itemContent: Node = null!;
    @property(Prefab)
    private itemPrefab: Prefab = null!;
   

    private gemConfigs: BuyGemsConfig[] = [];

    onLoad() {
        this.btn_close?.node.on(Button.EventType.CLICK, () => { oops.gui.remove(UIID.PropShop, false); }, this);
        this.initUI();
     
    }

    /** 初始化购买选项 */
    private async initUI() {
        this.gemConfigs = [];//要修改为道具信息
        this.itemContent.removeAllChildren();
        const res = await AccountNetService.getBugGemConfig();
        if (res && res.buyGemsConfigArr != null) {
            this.gemConfigs = res.buyGemsConfigArr;
            this.gemConfigs.sort((a, b) => a.id - b.id);
            let level = 1;
            for (const gemConfig of this.gemConfigs) {
                this.createItem(gemConfig, level);
                level++;
            }
        }
    }

    private createItem(gemConfig: any, level: number = 1) {
        let itemNode = instantiate(this.itemPrefab);
        if (itemNode) {
            this.itemContent.addChild(itemNode);
            const comp = itemNode.getComponent(PropShopItem);
            if (comp) {
                comp.initItem(gemConfig, level);
                comp.onItemClicked = this.onItemClicked.bind(this);
            }
        }
    }

    private async onItemClicked(configId: number) {
        // var uic: UICallbacks = {
        //     onAdded: (node: Node, params: any) => {
        //         node.getComponent(WalletPaySelect)?.initConfig(configId);
        //         oops.gui.remove(UIID.PropShop, false);
        //     },
        //     onRemoved: (node: Node | null, params: any) => {
        //         oops.gui.open(UIID.PropShop);
        //     }
        // };
        // let uiArgs: any;
        // oops.gui.open(UIID.WalletPaySelect, uiArgs, uic);
        // return;
    }


}