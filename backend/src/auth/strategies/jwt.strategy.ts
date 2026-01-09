import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'GIZLI_KELIME', // AuthModule içindeki ile aynı olmalı
    });
  }

  async validate(payload: any) {
    // Bu metodun döndürdüğü değer req.user içine atılır
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
