import { CanActivate, Injectable } from '@nestjs/common';

@Injectable()
export class PublicGuard implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}
