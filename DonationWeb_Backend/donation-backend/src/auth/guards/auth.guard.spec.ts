import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { describe, expect, it, vi } from 'vitest';
import { AuthGuard } from './auth.guard.js';

describe('AuthGuard', () => {
  const createContext = (request: object) =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    }) as ExecutionContext;

  it('rejects requests without a token cookie', async () => {
    const jwtService = { verifyAsync: vi.fn() } as unknown as JwtService;
    const guard = new AuthGuard(jwtService);

    await expect(guard.canActivate(createContext({ cookies: {} }))).rejects.toThrow(
      new UnauthorizedException('Please login first'),
    );
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('rejects requests with an invalid token', async () => {
    const jwtService = {
      verifyAsync: vi.fn().mockRejectedValue(new Error('invalid token')),
    } as unknown as JwtService;
    const guard = new AuthGuard(jwtService);

    await expect(
      guard.canActivate(createContext({ cookies: { token: 'invalid-token' } })),
    ).rejects.toThrow(new UnauthorizedException('Invalid or expired token'));
  });

  it('stores the verified payload on the request', async () => {
    const payload = { id: 'user-id', role: 'user' };
    const jwtService = {
      verifyAsync: vi.fn().mockResolvedValue(payload),
    } as unknown as JwtService;
    const guard = new AuthGuard(jwtService);
    const request = { cookies: { token: 'valid-token' } } as {
      cookies: { token: string };
      user?: typeof payload;
    };

    await expect(guard.canActivate(createContext(request))).resolves.toBe(true);

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
    expect(request.user).toEqual(payload);
  });
});
