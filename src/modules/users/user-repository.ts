import { prisma } from '../../infrastructure/database/prisma-client.ts';
import { supabase } from '../../infrastructure/database/supabase.ts';
import type { UserSignInType, UserSignUpType } from '../../types/user-type.ts';

export default class UserRepository {
  signUpUser = async ({
    full_name,
    email,
    password,
    username,
  }: UserSignUpType) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          username,
        },
      },
    });
  };

  signInUser = async ({ email, password }: UserSignInType) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  userLogOut = async () => {
    return await supabase.auth.signOut();
  };

  updateAvatarUser = async (id: string, avatarUrl: string | null) => {
    return await prisma.users.update({
      where: {
        id,
      },
      data: {
        avatar_url: avatarUrl,
      },
    });
  };
}
