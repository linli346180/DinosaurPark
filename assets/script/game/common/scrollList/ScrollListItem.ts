import { _decorator, Component, } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScrollListItem')
export class ScrollListItem extends Component implements IScrollListItem {
    /**滚动列表数据变更*/
    public onItemRender(data: any, ...param: any[]): void { }
}

export interface IScrollListItem {
    onItemRender(data: any, ...param: any[]): void
}
