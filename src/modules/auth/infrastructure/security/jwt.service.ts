import * as jwt from 'jsonwebtoken';

export class JwtService {
  static generateToken(
    payload: any,
    secret: string,
    expiresIn: string,
  ): string {
    return jwt.sign(payload, secret, { expiresIn });
  }

  static verifyToken(token: string, secret: string): any {
    return jwt.verify(token, secret);
  }
}
