import { _decorator, Component, Node } from 'cc';
import { ecs } from '../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS';
import { UserCoinData, UserCoinIncome } from '../CoinDefine';

/** 
 * 用户货币数据 
 */
@ecs.register('CoinModelComp')
export class CoinModelComp extends ecs.Comp {
    coinPoolData: UserCoinIncome = new UserCoinIncome(); // 户货币数据(待领取)
    CoinData: UserCoinData = new UserCoinData(); // 户货币数据
    public createCoinData() {
        this.coinPoolData = new UserCoinIncome();
        this.CoinData = new UserCoinData();
    }
    reset(){
        this.coinPoolData = new UserCoinIncome();
        this.CoinData = new UserCoinData();
    }
}


