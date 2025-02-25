import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class PublicGuard implements CanActivate {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}
