import { _decorator, sys } from 'cc';
import { ecs } from '../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS';
import { AccountModelComp } from '../model/AccountModelComp';
import { Account } from '../Account';
import { oops } from '../../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { AccountNetService } from '../AccountNet';
import { TGNetService } from '../../../telegram/TGNet';
import { GameEvent } from '../../common/config/GameEvent';
import { netConfig } from '../../../net/custom/NetConfig';

@ecs.register('AccountLogin')
export class AccountLoginComp extends ecs.Comp {
    reset() { }
}

@ecs.register('Account')
export class AccountLoginData extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(AccountLoginComp, AccountModelComp);
    }

    async entityEnter(entity: Account): Promise<void> {
        console.log(`【当前平台】${sys.platform}【运行系统】${sys.os} 【浏览器类型】${sys.browserType}`);
        try {
            if (netConfig.ExampleLogin) {
                console.log("使用测试登陆");
                const response = await AccountNetService.LoginTestAccount();
                if(!response) return;
                this.onLogonSucess(entity, response);
            } else {
                console.log("使用TD登陆");
                const TGAppData = await TGNetService.GetTelegramAPPData();
                await AccountNetService.getUserRoute(TGAppData.UserData.id.toString());
                const response = await AccountNetService.LoginTGAcount(TGAppData);
                if(!response) return;
                this.onLogonSucess(entity, response);
            }
            oops.message.dispatchEvent(GameEvent.LoginSuccess);
            entity.remove(AccountLoginComp);
        } catch (error) {
            console.error("登录失败:", error);
        }
    }

    private onLogonSucess(entity: Account, response: any) {
        entity.AccountModel.userData = response.user;
        entity.AccountModel.coinPoolData = response.userCoinIncome;
        entity.AccountModel.noOperationMail = response.noOperationMail;
        entity.AccountModel.noOperationTask = response.noOperationTask;
    }
}