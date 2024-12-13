import { _decorator, Component, Node } from 'cc';
import { ecs } from '../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS';
import { oops } from '../../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { AccountEvent } from '../../account/AccountEvent';
import { CoinModelComp } from '../model/CoinModelComp';
import { CoinNetService } from '../CoinNet';
import { CoinType } from '../CoinDefine';
import { UpdateCoinDate } from '../system/UpdateCoinDate';
import { GameEvent } from '../../common/config/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('CoinEntity')
export class CoinEntity extends ecs.Entity {
    // 货币数据
    CoinModel !: CoinModelComp;

    // 收集数据

    // 业务层System
    //UpdateCoinDate !: UpdateCoinDate;

    /** 获取金币数据 */
    public updateCoinData() {
        this.add(UpdateCoinDate);
    }

    /** 获取金币数据 */
    // public updaeCoinData() {
    //     this.add(AccountLoginComp);
    // }
    protected init() {
        this.addComponents<ecs.Comp>(CoinModelComp);
        oops.message.on(GameEvent.LoginSuccess, this.onHandler, this);
    }
    destroy(): void {
        oops.message.off(GameEvent.LoginSuccess, this.onHandler, this);
        super.destroy();
    }

    private async onHandler(event: string, args: any) {
        this.updateCoinData();
    }

    /** 收集金币 */
    public async UseCollectCoin(coinType: CoinType) {
        let res: any = null;
        if (coinType == CoinType.Gold)
            res = await CoinNetService.UseCollectCoin();
        if (coinType == CoinType.Gems)
            res = await CoinNetService.UseCollectGem();

        if (res && res.userCoin) {
            this.CoinModel.CoinData = res.userCoin;
            oops.message.dispatchEvent(AccountEvent.CoinDataChange);
        }
    }
}


