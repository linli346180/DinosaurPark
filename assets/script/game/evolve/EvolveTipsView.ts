import { _decorator, Component, Button, RichText } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { AccountNetService } from '../account/AccountNet';
const { ccclass, property } = _decorator;

@ccclass('EvolveTipsView')
export class EvolveTipsView extends Component {
    @property(Button) btn_close: Button = null!;
    @property(RichText) richText: RichText = null!;

    onLoad() {
        this.richText.string = '';
        this.btn_close.node.on(Button.EventType.CLICK, this.closeUI, this);
    }

    async initUI(key: string) {
        const res = await AccountNetService.getLanguageConfig(key);
        if (res?.languageConfigArr?.length > 0) {
            this.richText.string = res.languageConfigArr[0].description;
        }
    }

    private closeUI() {
        oops.gui.remove(UIID.EvolveTips, true);
    }
}