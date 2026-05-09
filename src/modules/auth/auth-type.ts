type AuthPayload = {
  email: string;
  password: string;
  fullName: string;
  username: string;
  role?: 'admin' | 'user';
  avatarUrl?: string;
};

export type AuthSignUpType = Pick<
  AuthPayload,
  'email' | 'fullName' | 'username' | 'password'
>;

export type AuthSignInType = Pick<AuthPayload, 'email' | 'password'>;
