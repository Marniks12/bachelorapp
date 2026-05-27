import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

type JwtPayload = {
  userId: string;
};

export type AuthenticatedUser = {
  _id: Types.ObjectId;
  email: string;
  name: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return secret;
}

export function createAuthToken(user: { _id: Types.ObjectId; email: string; name: string }): string {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    },
    getJwtSecret(),
    { expiresIn: '7d' },
  );
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length).trim() : null;

  if (!token) {
    res.status(401).json({ message: 'Authenticatie vereist' });
    return;
  }

  try {
    const payload = jwt.verify(token, getJwtSecret()) as JwtPayload & { email?: string; name?: string };

    if (!Types.ObjectId.isValid(payload.userId)) {
      res.status(401).json({ message: 'Ongeldig authenticatietoken' });
      return;
    }

    req.user = {
      _id: new Types.ObjectId(payload.userId),
      email: typeof payload.email === 'string' ? payload.email : '',
      name: typeof payload.name === 'string' ? payload.name : '',
    };

    next();
  } catch {
    res.status(401).json({ message: 'Ongeldig authenticatietoken' });
  }
}
