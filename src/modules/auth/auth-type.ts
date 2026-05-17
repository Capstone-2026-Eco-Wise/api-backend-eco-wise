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

export type UpdatePasswordType = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type AuthUpdatePasswordType = Pick<AuthPayload, 'password'> & {
  userId: string;
};

export type AuthServiceUpdatePasswordType = UpdatePasswordType & {
  userId: string;
  email: string;
};
