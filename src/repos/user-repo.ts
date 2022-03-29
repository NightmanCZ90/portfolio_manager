import { User } from '@prisma/client';
import { Auth } from '../models/auth';
import { BaseUser } from '../models/user';
import { prisma } from '../server';

class UserRepo {

  static async find(): Promise<User[]> {
    const users = await prisma.user.findMany();

    return users;
  }

  static async findById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });

    return user;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });

    return user;
  }

  static async register({ email, password }: Auth): Promise<User> {
    const user = await prisma.user.create({
      data: {
        email,
        password,
      }
    });

    return user;
  }

  // for testing purposes
  static async _insert(user: BaseUser): Promise<User> {
    const createdUser = prisma.user.create({
      data: user
    });

    return createdUser;
  }

  static async update(user: User): Promise<User> {
    const { id, firstName, lastName, role } = user;

    const updatedUser = prisma.user.update({
      where: { id },
      data: {
        updatedAt: new Date(),
        firstName,
        lastName,
        role
      },
    });

    return updatedUser;
  }
}

export default UserRepo;
