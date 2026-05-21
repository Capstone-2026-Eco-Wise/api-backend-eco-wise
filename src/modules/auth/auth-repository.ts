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
