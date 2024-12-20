import { _decorator, Component, Node, Vec3, Button, Collider2D, math, v3 } from 'cc';
import { mapConfig } from './MapConfig';
import { oops } from '../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { AccountEvent } from '../account/AccountEvent';
import { smc } from '../common/SingletonModuleComp';
import { ViewUtil } from '../../../../extensions/oops-plugin-framework/assets/core/utils/ViewUtil';
import { StartBeastData, UserSTBType } from '../account/model/AccountModelComp';
import { ActorController } from '../character/state/ActorController';
import { RvoMgr } from '../../RVO/RvoMgr';
import { StringUtil } from '../common/utils/StringUtil';
import { TableSTBConfig } from '../common/table/TableSTBConfig';
import { clear } from 'console';
const { ccclass, property } = _decorator;

const tmpP0 = v3();
const tmpP1 = v3();

@ccclass('MapComponent')
export class MapComponent extends Component {
    @property(Node) mapRoot: Node = null!;
    @property(Node) delNode: Node = null!;
    private delList: number[] = [];
    private timeoutId: NodeJS.Timeout;
    onLoad(): void {
        RvoMgr.radius = 80;
        RvoMgr.neighborDist = RvoMgr.radius * 1.7;
        RvoMgr.maxSpeed = 100;
        RvoMgr.updateCd = 0.05;
        RvoMgr.initSimulator();
    }

    start() {
        oops.message.on(AccountEvent.AddInComeSTB, this.onHandler, this);
        oops.message.on(AccountEvent.DelIncomeSTB, this.onHandler, this);
        this.initUI();
    }

    onDestroy() {
        RvoMgr.reset();
        oops.message.off(AccountEvent.AddInComeSTB, this.onHandler, this);
        oops.message.off(AccountEvent.DelIncomeSTB, this.onHandler, this);
    }

    update(dt: number) {
        RvoMgr.update(dt);
    }

    private onHandler(event: string, args: any) {
        switch (event) {
            case AccountEvent.AddInComeSTB:
                this.autoFillUserSTB();
                break;
            case AccountEvent.DelIncomeSTB:
                this.delUserSTBItem(args);
                this.autoFillUserSTB();
                break;
        }
    }

    private initUI() {
        this.delList = [];
        this.fillUserSTB();
    }

    /** 延迟等待填充 */
    private autoFillUserSTB() {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.fillUserSTB();
        }, 1000);
    }

    private fillUserSTB() {
        const stbConfigTypes = [110, 201, 301, 302, 303, 401];
        stbConfigTypes.forEach(type => {
            const limitNum = type === 110 ? 5 : 1;
            this.fillUserSTBMap(type, limitNum, limitNum);
        });
    }

    /** 自动填充玩家星兽 */
    private fillUserSTBMap(stbConfigType: number, limitNum: number, createNum: number = 1) {
        // 获取所有星兽数据
        const stbDataList = smc.account.getSTBDataByConfigType(stbConfigType);
        const stbNum = stbDataList.length;
        if (stbNum === 0) return;

        const stbConfig = smc.account.getSTBConfigByType(stbConfigType);
        const existNum = this.getExistChildCount(stbConfigType);
        if (existNum >= limitNum) {
            console.warn('星兽已满,不再显示:', stbConfigType);
            return;
        }
        const stbTable = new TableSTBConfig();
        stbTable.init(stbConfigType);
        let fillNum = Math.min(stbNum, limitNum - existNum);
        fillNum = Math.min(fillNum, createNum);

        console.log('创建星兽:', stbConfigType, '已有:', existNum, '需要:', fillNum);

        for (const stbData of stbDataList) {
            if (!this.isSTBExist(stbData.id) && fillNum > 0) {
                this.createSTBItem(stbConfigType, stbData, stbTable.perfab);
                fillNum--;
            }
        }
    }

    private async createSTBItem(stbConfigType: number, stbData: StartBeastData, prefabPath: string) {
        const itemNode = await ViewUtil.createPrefabNodeAsync(prefabPath);
        if (itemNode) {
            itemNode.name = stbData.id.toString();
            itemNode.setParent(this.mapRoot);

            tmpP0.x = math.randomRange(mapConfig.widthLimit.x, mapConfig.widthLimit.y);
            tmpP0.y = math.randomRange(mapConfig.heightLimit.x, mapConfig.heightLimit.y);
            itemNode.setPosition(tmpP0);

            const cmp = itemNode.getComponent(ActorController);
            if (cmp) {
                cmp.stbId = stbData.id;
                cmp.stbConfigType = stbConfigType;
                cmp.widthLimit = mapConfig.widthLimit;
                cmp.heightLimit = mapConfig.heightLimit;
                cmp.init(tmpP0, Vec3.ZERO);
            }
        } else {
            console.error('创建星兽失败:', stbData.id);
        }
    }

    private delUserSTBItem(stbId: number) {
        const childNode = this.mapRoot.children.find(child => {
            const cmp = child.getComponent(ActorController);
            return cmp && cmp.stbId === stbId;
        });

        if (childNode) {
            childNode.getComponent(Collider2D).enabled = false;
            this.delList.push(stbId);
            childNode.getComponent(ActorController).onActorDeath();
            console.log('删除星兽:', stbId);
        } else {
            console.error('删除星兽失败:', stbId);
        }
    }

    /** 获取指定星兽类型的数量 */
    private getExistChildCount(stbConfigType: number): number {
        let stbCount = 0;
        this.mapRoot.children.forEach(child => {
            const cmp = child.getComponent(ActorController);
            if (cmp && cmp.stbConfigType === stbConfigType && !this.delList.includes(cmp.stbId)) {
                stbCount++;
            }
        });
        return stbCount;
    }

    private isSTBExist(stbId: number): boolean {
        return this.mapRoot.children.some(child => {
            const cmp = child.getComponent(ActorController);
            return cmp && cmp.stbId === stbId && !this.delList.includes(stbId);
        });
    }
}