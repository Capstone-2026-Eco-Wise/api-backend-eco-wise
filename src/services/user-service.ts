import { ErrorFactory } from '../errors/error-factory.ts';
import { logger } from '../infrastructure/logger/logger.ts';
import UserRepository from '../repositories/user-repository.ts';
import type { UserSignInType, UserSignUpType } from '../types/user-type.ts';
export default class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.registerUser = this.registerUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
  }

  async registerUser(payloadUserSignUp: UserSignUpType) {
    logger.info(
      `[User Service]: Signing up user with email: ${payloadUserSignUp.email}`,
    );

    const { data: userSignUp, error: errorUserSignUp } =
      await this.userRepository.signUpUser(payloadUserSignUp);

    if (errorUserSignUp) {
      logger.error(`[User Service]: ${errorUserSignUp.message}`);

      throw ErrorFactory.clientError(
        errorUserSignUp.message,
        errorUserSignUp.status,
      );
    }

    logger.info(
      `[User Service]: User signed up successfully for ${payloadUserSignUp.email}`,
    );
    return userSignUp;
  }

  async loginUser(payloadUserSignIn: UserSignInType) {
    logger.info(
      `[User Service]: Logging in user with email: ${payloadUserSignIn.email}`,
    );

    const { data: userSignIn, error: errorUserSignIn } =
      await this.userRepository.signInUser(payloadUserSignIn);

    if (errorUserSignIn) {
      logger.error(`[User Service]: ${errorUserSignIn.message}`);

      throw ErrorFactory.clientError(
        errorUserSignIn.message,
        errorUserSignIn.status,
      );
    }

    logger.info(
      `[User Service]: User logged in successfully for ${payloadUserSignIn.email}`,
    );

    return userSignIn;
  }

  async sessionUser(id: string) {
    logger.info(`[User Service]: Getting session user for ${id}`);

    const user = await this.userRepository.getSessionUser(id);

    if (!user) {
      logger.error(`[User Service]: No session found for ${id}`);

      throw ErrorFactory.authenticationError('Please login');
    }

    logger.info(`[User Service]: User session found for ${id}`);

    return user;
  }

  async logoutUser() {
    logger.info(`[User Service]: Logging out user`);

    const { error: errorUserLogOut } = await this.userRepository.userLogOut();

    if (errorUserLogOut) {
      logger.error(`[User Service]: ${errorUserLogOut.message}`);

      throw ErrorFactory.clientError(
        errorUserLogOut.message,
        errorUserLogOut.status,
      );
    }

    return 'User has been logged out';
  }
}
