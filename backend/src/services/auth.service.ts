import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '24h';

export class AuthService {
  static generateToken(user: { id: number; phone?: string; email?: string }): string {
    const payload: any = { id: user.id };
    if (user.phone) payload.phone = user.phone;
    if (user.email) payload.email = user.email;
    // Use `any` casts to avoid mismatched type overloads from @types/jsonwebtoken
    return jwt.sign(payload as any, JWT_SECRET as any, { expiresIn: JWT_EXPIRE } as any);
  }

  static async login(identifier: string, password: string) {
    // Determine whether identifier is email or phone
    const isEmail = identifier.includes('@');
    const where = isEmail ? { email: identifier } : { phone: identifier };

    // Find user
    const user = await prisma.user.findUnique({ where });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken({ id: user.id, phone: user.phone, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        email: user.email,
      },
    };
  }

  static async signup(username: string, phone: string, email: string, password: string) {
    // Check if user exists by phone or email or username
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone },
          { email },
          { username }
        ]
      }
    });
    if (existingUser) {
      throw new Error('User already exists (phone/email/username)');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Create new user
    const user = await prisma.user.create({
      data: {
        username,
        phone,
        email,
        password: hashed,
      },
    });

    // Generate token
    const token = this.generateToken({ id: user.id, phone: user.phone, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        email: user.email,
      },
    };
  }
}