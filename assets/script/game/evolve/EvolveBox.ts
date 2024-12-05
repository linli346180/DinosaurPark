import { Button } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { smc } from '../common/SingletonModuleComp';
const { ccclass, property } = _decorator;

@ccclass('EvolveBox')
export class EvolveBox extends Component {
    @property(Button) btn_item: Button = null!;
    @property(Node) icon_301: Node = null!;
    @property(Node) icon_302: Node = null!;
    @property(Node) icon_303: Node = null!;

    onLoad() {
        this.btn_item.node.on(Button.EventType.CLICK, this.onItemClick, this);
        if (!this.updateIconVisibility(303, this.icon_303)) {
            if (!this.updateIconVisibility(302, this.icon_302)) {
                this.updateIconVisibility(301, this.icon_301);
            }
        }
    }

    private updateIconVisibility(type: number, icon: Node): boolean {
        const stbConfig = smc.account.getSTBConfigByType(type);
        if (stbConfig && smc.account.getUserInstbCount(stbConfig.id) > 0) {
            icon.active = true;
            return true;
        }
        return false
    }

    private onItemClick() {
        oops.gui.open(UIID.Evolve);
    }
}