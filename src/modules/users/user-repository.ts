import type { Prisma } from '../../../generated/prisma/client.ts';
import { prisma } from '../../infrastructure/database/prisma-client.ts';
import { supabase } from '../../infrastructure/database/supabase.ts';
import type { UserSignInType, UserSignUpType } from '../../types/user-type.ts';

export default class UserRepository {
  async signUpUser({ full_name, email, password, username }: UserSignUpType) {
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
  }

  async signInUser({ email, password }: UserSignInType) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async getSessionUser(id: string, option?: Prisma.UsersFindUniqueArgs) {
    return await prisma.users.findUnique({
      where: {
        id,
      },
      ...option,
    });
  }

  async userLogOut() {
    return await supabase.auth.signOut();
  }

  async updateAvatarUser(id: string, avatarUrl: string) {
    return await prisma.users.update({
      where: {
        id,
      },
      data: {
        avatar_url: avatarUrl,
      },
    });
  }
}
