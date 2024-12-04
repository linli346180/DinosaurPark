import { ecs } from '../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS';
import { oops } from '../../../../../extensions/oops-plugin-framework/assets/core/Oops';
import { AccountModelComp } from '../model/AccountModelComp';
import { Account } from '../Account';
import { AccountEvent } from '../AccountEvent';

@ecs.register('AccountEmail')
export class AccountEmailComp extends ecs.Comp {
    /** 昵称 */
    email: string = null!;

    reset(): void {
        this.email = null!;
    }
}

@ecs.register('Account')
export class AccountEmailSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(AccountEmailComp, AccountModelComp);
    }

    entityEnter(e: Account): void {
        let newEmail = e.AccountEmail.email;
        oops.message.dispatchEvent(AccountEvent.ChangeEmail, newEmail);
        e.remove(AccountEmailComp);
    }
}