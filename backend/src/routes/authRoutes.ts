import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { Types } from 'mongoose';

import { createAuthToken } from '../middleware/authMiddleware';
import { User } from '../models/User';

export const authRouter = Router();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toAuthResponse(user: { _id: Types.ObjectId; name: string; email: string }) {
  return {
    token: createAuthToken({
      _id: user._id,
      name: user.name,
      email: user.email,
    }),
    user: {
      _id: String(user._id),
      name: user.name,
      email: user.email,
    },
  };
}

authRouter.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };

    const normalizedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password) {
      res.status(400).json({ message: 'Naam, e-mail en wachtwoord zijn verplicht' });
      return;
    }

    if (!emailPattern.test(normalizedEmail)) {
      res.status(400).json({ message: 'Vul een geldig e-mailadres in' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ message: 'Wachtwoord moet minstens 8 tekens bevatten' });
      return;
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      res.status(409).json({ message: 'Er bestaat al een account met dit e-mailadres' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
    });

    res.status(201).json(toAuthResponse(user));
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      res.status(400).json({ message: 'E-mail en wachtwoord zijn verplicht' });
      return;
    }

    if (!emailPattern.test(normalizedEmail)) {
      res.status(400).json({ message: 'Vul een geldig e-mailadres in' });
      return;
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      res.status(401).json({ message: 'Ongeldige e-mail of wachtwoord' });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      res.status(401).json({ message: 'Ongeldige e-mail of wachtwoord' });
      return;
    }

    res.json(toAuthResponse(user));
  } catch (error) {
    next(error);
  }
});
