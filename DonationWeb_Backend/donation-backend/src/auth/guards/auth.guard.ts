import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

type AuthenticatedRequest = Request & {
    user: Record<string, unknown>;
};

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

        // Get token from cookie
        const token = request.cookies?.token;

        if (!token) {
            throw new UnauthorizedException('Please login first');
        }

        try {

            const payload = await this.jwtService.verifyAsync(token);

            // Save decoded JWT data in request
            request.user = payload;

        } catch {

            throw new UnauthorizedException('Invalid or expired token');
        }

        return true;
    }
}