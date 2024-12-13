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
const { ccclass, property } = _decorator;

const tmpP0 = v3();
const tmpP1 = v3();

@ccclass('MapComponent')
export class MapComponent extends Component {
    @property(Node) mapRoot: Node = null!;
    @property(Node) delNode: Node = null!;
    private delList: number[] = [];
    private waitList: number[] = [];

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
        // 防止超出个数限制
        if (this.waitList.length > 0) {
            const stbId = this.waitList.shift();    // 移除并返回第一个元素
            this.createUserSTB(stbId);
        }
    }

    private onHandler(event: string, args: any) {
        switch (event) {
            case AccountEvent.AddInComeSTB:
                this.waitList.push(args);
                break;

            case AccountEvent.DelIncomeSTB:
                this.delUserSTBItem(args);
                this.unschedule(this.fillUserSTB);
                this.scheduleOnce(this.fillUserSTB, 1);
                break;
        }
    }

    private initUI() {
        this.delList = [];
        this.fillUserSTB();
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
        const stbDataList = smc.account.getSTBDataByConfigType(stbConfigType);
        const stbNum = stbDataList.length;
        if (stbNum === 0) return;

        const stbConfig = smc.account.getSTBConfigByType(stbConfigType);
        const existList = this.getChildCount(stbConfigType, stbConfig.id);
        if (existList.length >= limitNum) {
            console.warn('星兽已满,不再显示:', stbConfigType);
            return;
        }
        const stbTable = new TableSTBConfig();
        stbTable.init(stbConfigType);
        let fillNum = Math.min(stbNum, limitNum - existList.length);
        fillNum = Math.min(fillNum, createNum);

        console.log('创建星兽:', stbConfigType, '已有:', existList.length, '需要:', fillNum);

        stbDataList.forEach(stbData => {
            if (!existList.includes(stbData.id) && fillNum > 0) {
                this.createSTBItem(stbConfigType, stbData, stbTable.perfab);
                fillNum--;
            }
        });
    }

    private createUserSTB(stbId: number) {
        const stbData = smc.account.getUserSTBData(stbId, UserSTBType.InCome);
        if (!stbData) {
            console.error('创建星兽失败:', stbId);
            return;
        }
        const stbConfig = smc.account.getSTBConfigById(stbData.stbConfigID);
        if (!stbConfig) {
            console.error('创建星兽失败:', stbId);
            return;
        }
        const stbConfigType = StringUtil.combineNumbers(stbConfig.stbKinds, stbConfig.stbGrade, 2);
        const limitNum = stbConfigType === 110 ? 5 : 1;
        this.fillUserSTBMap(stbConfigType, limitNum, 1);
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
        } else {
            console.error('删除星兽失败:', stbId);
        }
    }

    /** 获取指定星兽类型的数量 */
    private getChildCount(stbConfigType: number, stbId: number): number[] {
        return this.mapRoot.children
            .filter(child => {
                const cmp = child.getComponent(ActorController);
                return cmp && cmp.stbConfigType === stbConfigType && !this.delList.includes(stbId);
            })
            .map(child => stbId);
    }
}