import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserData } from '@app/users/interfaces/current-user-data';

const REQUEST_USER_KEY = 'user';

export const CurrentUser = createParamDecorator(
    (field: keyof CurrentUserData | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user: CurrentUserData | undefined = request[REQUEST_USER_KEY];
        return field ? user?.[field] : user;
    },
);
