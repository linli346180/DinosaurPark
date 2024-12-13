import { Label } from 'cc';
import { Button } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Accelerate')
export class Accelerate extends Component {
    @property(Button)
    btn_gemShop: Button = null!;
    @property(Button)
    btn_close: Button = null!;
    @property(Button)
    btn_free: Button = null!;
    @property(Button)
    btn_propShop: Button = null!;
    @property(Label)
    gemsNum: Label = null!;
    @property(Label)
    downTime: Label = null!;
    @property(Label)
    collectionSpeed: Label = null!;
    @property(Label)
    speed: Label = null!;
    start() {

    }

    update(deltaTime: number) {
        
    }
}


