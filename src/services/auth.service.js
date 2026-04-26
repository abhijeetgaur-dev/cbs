import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users } from '../db/schema/users.js';

export const registerUser = async ({ name, email, password, role }) => {
  const existingUsers = await db.select().from(users).where(eq(users.email, email));
  if (existingUsers.length > 0) {
    const error = new Error('Email already in use');
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [newUser] = await db.insert(users).values({
    name,
    email,
    passwordHash,
    role,
  }).returning({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
    createdAt: users.createdAt
  });

  return newUser;
};

export const loginUser = async ({ email, password }) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
     throw new Error('JWT_SECRET is not defined');
  }


  const token = jwt.sign(
    { id: user.id, role: user.role },
    secret,
    { expiresIn: '24h' }
  );

  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
};
