import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "../../user/user.entity.js";
import { ROLES_KEY } from "./roles.decorator.js";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean  {
        const requireRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ])

        if(!requireRoles){
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        return requireRoles.some((role) => user.role === role)
    }
}