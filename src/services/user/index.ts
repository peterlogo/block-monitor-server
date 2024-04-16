import type {
  IUserDataAccessObject,
  IUserService,
  User
} from '../../types/user';

/**
 * User Service.
 * Handles all interactions with the User model.
 * Responsible for creating, reading, updating, and deleting user data.
 * @class
 * @implements {IUserService}
 */
export class UserService implements IUserService {
  private userDao: IUserDataAccessObject;

  constructor({ userDao }: { userDao: IUserDataAccessObject }) {
    this.userDao = userDao;
  }

  async createUser(user: User): Promise<User> {
    return await this.userDao.create(user);
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userDao.getById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userDao.getByEmail(email);
  }

  async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    return await this.userDao.update(id, user);
  }

  async deleteUser(id: string): Promise<User | null> {
    return await this.userDao.delete(id);
  }
}
