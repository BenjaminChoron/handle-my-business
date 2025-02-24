import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtSecretNotDefinedException } from '../../domain/exceptions/user.exceptions';
import { JwtService } from './jwt.service';

@Injectable()
export class RoleGuard implements CanActivate {
  private readonly jwtSecret: string;

  constructor(private readonly requiredRole: string) {
    this.jwtSecret = process.env.JWT_SECRET ?? '';
    if (!this.jwtSecret) {
      throw new JwtSecretNotDefinedException();
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      return false;
    }

    const decoded = JwtService.verifyToken(token, this.jwtSecret);
    const user = decoded;

    if (!user || user.role !== this.requiredRole) {
      return false;
    }

    return true;
  }
}
