import { Button } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { UIID } from '../common/config/GameUIConfig';
import { RichText } from 'cc';
import { EvolueNetService } from './EvolveNet';
import { UserConfigData } from '../home/UserConfigDefine';
const { ccclass, property } = _decorator;

@ccclass('EvolveTipsView')
export class EvolveTipsView extends Component {
    @property(Button) btn_close: Button = null!;
    @property(RichText) richText: RichText = null!;
    private configData: UserConfigData[] = [];
    onLoad() {
        this.btn_close.node.on(Button.EventType.CLICK, this.closeUI, this);
        this.richText.string = '';
        EvolueNetService.getEvolveTips().then((res) => {    
            if (res && res.languageConfigArr&& res.languageConfigArr.length>0) {
                this.configData = res.languageConfigArr;
                this.richText.string =res.languageConfigArr[0].description;
            }
        });
    }

    private closeUI() {
        oops.gui.remove(UIID.EvolveTips);
    }
}