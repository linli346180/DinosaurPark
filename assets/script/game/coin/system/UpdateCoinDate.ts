import { _decorator, Component, Node } from 'cc';
import { ecs } from '../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS';
import { oops } from '../../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { CoinEntity } from '../entity/CoinEntity';
import { CoinModelComp } from '../model/CoinModelComp';
import { netConfig } from '../../../net/custom/NetConfig';
import { GameEvent } from '../../common/config/GameEvent';
import { sys } from 'cc';
import { AccountNetService } from '../../account/AccountNet';
import { TGNetService } from '../../../telegram/TGNet';

@ecs.register('UpdateCoinDate')
export class UpdateCoinDate extends ecs.Comp {
    reset() { }//重置状态
}
@ecs.register('CoinData')
export class CoinData extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
     // 设置该系统的过滤器，定义哪些实体会被该系统处理
    filter(): ecs.IMatcher {
        // 筛选实体
        return ecs.allOf(UpdateCoinDate, CoinModelComp);
    }
    async entityEnter(entity: CoinEntity): Promise<void> {
        // 处理实体进入事件
        console.log(`【当前平台】'+ ${sys}【运行系统】${sys.os} 【浏览器类型】${sys.browserType}`);
        if (netConfig.ExampleLogin) {
            console.log("使用测试登陆")
            await AccountNetService.LoginTestAccount().then((response) => {
                this.onLogonSucess(entity, response)
            });
        } else {
            console.log("使用TD登陆")
            const TGAppData = await TGNetService.GetTelegramAPPData();
            await AccountNetService.getUserRoute(TGAppData.UserData.id.toString());
            await AccountNetService.LoginTGAcount(TGAppData).then((response) => {
                this.onLogonSucess(entity, response)
            });
        }
        oops.message.dispatchEvent(GameEvent.LoginSuccess);
        entity.remove(UpdateCoinDate);
    }
    // 更新数值
    private onLogonSucess(entity: CoinEntity, response: any) {
        entity.CoinModel.CoinData = response.user;
        entity.CoinModel.coinPoolData = response.userCoinIncome;
    }
}