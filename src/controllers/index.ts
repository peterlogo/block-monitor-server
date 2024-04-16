import { UserDao } from '../dao';
import { UserService } from '../services';
import { UserModel } from '../models';

import { UserController } from './userController';
import { AuthController } from './authController';

/**
 * This is a factory function that creates instances of all controllers and returns them.
 * It is important to note that the controllers are created with all their dependencies.
 */
function createControllers() {
  const userDao = new UserDao({ model: UserModel });
  const userService = new UserService({ userDao });
  const userController = new UserController({ userService });
  const authController = new AuthController({ userService });

  return { userController, authController };
}

export const { authController, userController } = createControllers();
