import {
  stringArg, queryField, mutationField, nonNull,
} from 'nexus/dist';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../../env';

export const me = queryField('me', {
  type: 'User',
  resolve: (_, __, ctx) => {
    if (!ctx.userId) {
      throw new Error('Not authorized');
    }
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.userId,
      },
    });
  },
});

export const signIn = mutationField('signIn', {
  type: 'AuthPayload',
  args: {
    username: nonNull(stringArg()),
    password: nonNull(stringArg()),
  },
  resolve: async (_parent, { username, password }, ctx) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      throw new Error('user not found');
    }
    const passwordValid = (await compare(password, user.password || '')) || false;
    if (!passwordValid) {
      throw new Error('invalid password');
    }
    return {
      token: sign({ userId: user.id }, JWT_SECRET),
      user,
    };
  },
});

export const signUp = mutationField('signUp', {
  type: 'AuthPayload',
  args: {
    user: nonNull('UserCreateInput'),
  },
  resolve: async (_parent, { user }, ctx) => {
    const {
      username, password,
    } = user;
    const hashedPassword = await hash(password, 10);

    const created = await ctx.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    return {
      token: sign({ userId: created.id }, JWT_SECRET),
      user: created,
    };
  },
});
