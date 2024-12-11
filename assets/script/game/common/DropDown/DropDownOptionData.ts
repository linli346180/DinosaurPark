import { CCString } from "cc";
import { _decorator } from "cc";
import { SpriteFrame } from "cc";

const {ccclass, property} = _decorator;

@ccclass("DropDownOptionData")
export default class DropDownOptionData{
    // @property(String)
    @property
    public optionString: string = "";
    @property(SpriteFrame)
    public optionSf: SpriteFrame = undefined;
}
