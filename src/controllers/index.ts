import { UserDao, WebhookDao } from '../dao';
import { UserService, WebhookService } from '../services';
import { UserModel, WebhookModel } from '../models';

import { UserController } from './userController';
import { AuthController } from './authController';
import { WebhookController } from './webhookController';

/**
 * This is a factory function that creates
 * instances of all controllers and returns them.
 * It is important to note that the controllers
 * are created with all their dependencies.
 */
function createControllers() {
  // Create instances of all data access objects
  const userDao = new UserDao({ model: UserModel });
  const webhookDao = new WebhookDao({ model: WebhookModel });
  // Create instances of all services
  const userService = new UserService({ userDao });
  const webhookService = new WebhookService({ webhookDao });
  // Create instances of all controllers
  const userController = new UserController({ userService });
  const authController = new AuthController({ userService });
  const webhookController = new WebhookController({ webhookService });

  return { userController, authController, webhookController };
}

export const { authController, userController, webhookController } =
  createControllers();
