import jwt, { SignOptions } from 'jsonwebtoken';

type JwtPayload = {
  sub: number;
  email: string;
  name: string;
};

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return secret;
};

export function signAccessToken(payload: JwtPayload, expiresIn: string = process.env.JWT_EXPIRES_IN || '1d'): string {
  const secret = getJwtSecret();
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload, secret, options);
}

export function verifyAccessToken(token: string): JwtPayload & { iat: number; exp: number } {
  const decoded = jwt.verify(token, getJwtSecret());
  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }
  return decoded as unknown as JwtPayload & { iat: number; exp: number };
}



