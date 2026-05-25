import { prisma } from '../../infrastructure/database/prisma-client.ts';
import { supabase } from '../../infrastructure/database/supabase.ts';
import type {
  AuthSignInType,
  AuthSignUpType,
  AuthUpdatePasswordType,
} from './auth-type.ts';

export default class AuthRepository {
  signUp = async ({ email, fullName, username, password }: AuthSignUpType) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username,
        },
      },
    });
  };

  signUpRoleAdmin = async ({
    email,
    fullName,
    username,
    password,
  }: AuthSignUpType) => {
    const { data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username,
        },
      },
    });

    const userPrisma = await prisma.users.create({
      data: {
        id: data?.user?.id as string,
        email: data?.user?.email as string,
        fullName: data?.user?.user_metadata.full_name as string,
        username: data?.user?.user_metadata.username as string,
        role: 'admin',
        aiTokens: 0,
        tokenResetAt: new Date(data?.user?.created_at as string),
      },
    });

    return userPrisma;
  };

  signIn = async ({ email, password }: AuthSignInType) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  signOut = async (accessToken: string) => {
    return await supabase.auth.admin.signOut(accessToken);
  };

  updatePassword = async ({ userId, password }: AuthUpdatePasswordType) => {
    return await supabase.auth.admin.updateUserById(userId, {
      password,
    });
  };
}
