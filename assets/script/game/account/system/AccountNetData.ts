import { _decorator } from 'cc';
import { ecs } from '../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS';
import { AccountModelComp, StartBeastData } from '../model/AccountModelComp';
import { Account } from '../Account';
import { oops } from '../../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { AccountNetService } from '../AccountNet';
import { TGNetService } from '../../../telegram/TGNet';
import { GameEvent } from '../../common/config/GameEvent';
import { EDITOR } from 'cc/env';
import { sys } from 'cc';
import { userStbPrizeArr } from '../AccountDefine';


/** 请求玩家游戏数据 */
@ecs.register('AccountNetData')
export class AccountNetDataComp extends ecs.Comp {
    reset() { }
}

/** 请求玩家游戏数据 */
@ecs.register('Account')
export class AccountNetData extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(AccountNetDataComp, AccountModelComp);
    }

    async entityEnter(entity: Account): Promise<void> {
        // 获取用户货币数据
        const coinDataRes = await AccountNetService.getUserCoinData();
        if (coinDataRes && coinDataRes.userCoin) {
            entity.AccountModel.CoinData = coinDataRes.userCoin;
        }

        // 获取星兽配置数据
        const configDataRes = await AccountNetService.getStartBeastConfig();
        if (configDataRes && configDataRes.userInstbData) {
            configDataRes.userInstbData.sort((a, b) => a.id - b.id);
            entity.STBConfigMode.instbConfigData = configDataRes.userInstbData;

            // 获取玩家动态购买价格
            const UserPrizeRes = await AccountNetService.getUserPrize();
            if (UserPrizeRes && UserPrizeRes.userStbPrizeArr) {
                for(const prizeItem of UserPrizeRes.userStbPrizeArr){
                    for(const item of entity.STBConfigMode.instbConfigData){
                        if(prizeItem.stbConfigID == item.id){
                            item.purConCoinNum = prizeItem.extraPrize;
                        }
                    }
                }
            }
        }

        // 获取用户星兽数据
        const res = await AccountNetService.GetUserSTBData();
        if (res && res.userInstbData) {
            if (res.userInstbData.UserInstb) {
                entity.AccountModel.setUserInstb(res.userInstbData.UserInstb);
            }
            if (res.userInstbData.UserNinstb) {
                entity.AccountModel.setUserNinstb(res.userInstbData.UserNinstb);
            }
        }
        oops.message.dispatchEvent(GameEvent.DataInitialized);
        entity.remove(AccountNetDataComp);
    }
}
