import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles-auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0]; //тип токена
      const token = authHeader.split(' ')[1]; //токен

      // пустой headers.authorization (нет типа токена/токен)
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }

      if (!authHeader || bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }

      // раскодировать user
      const user = this.jwtService.verify(token);
      req.user = user;

      // проверка роли SELLER для создания магазина
      if (requiredRoles && requiredRoles.includes('SELLER')) {
        const hasSellerRole = user.roles.some(
          (role: { name: string }) => role.name === 'SELLER',
        );
        if (!hasSellerRole) {
          throw new HttpException(
            'Только пользователю с ролью SELLER может создать магазин!',
            HttpStatus.FORBIDDEN,
          );
        }
      }

      // общая проверка на другие роли
      return user.roles.some((role: { name: any }) =>
        requiredRoles.includes(role.name),
      );
    } catch {
      throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
    }
  }
}
