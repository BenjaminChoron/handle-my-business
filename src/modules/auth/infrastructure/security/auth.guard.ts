import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtSecretNotDefinedException } from '../../domain/exceptions/auth.exceptions';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly jwtSecret: string;

  constructor() {
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

    try {
      const decoded = JwtService.verifyToken(token, this.jwtSecret);
      request.user = decoded;
      return true;
    } catch {
      return false;
    }
  }
}
