import { Model } from 'mongoose';
import { IUserDataAccessObject, User } from '../types/user';
import { logger } from '../services';

/**
 * User Data Access Object.
 * Handles all interactions with the User model.
 * Responsible for creating, reading, updating, and deleting user data.
 * @class
 * @implements {IUserDataAccessObject}
 * @param {Model<User>} model - User model.
 */
export class UserDao implements IUserDataAccessObject {
  private model: Model<User>;

  constructor({ model }: { model: Model<User> }) {
    this.model = model;
  }

  async create(user: User): Promise<User> {
    try {
      return await this.model.create(user);
    } catch (error) {
      logger.error({ error }, 'Failed to create user');
      throw error;
    }
  }

  async getById(id: string): Promise<User | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      logger.error({ error }, 'Failed to get user by id');
      throw error;
    }
  }

  async getByEmail(email: string): Promise<User | null> {
    try {
      return await this.model.findOne({ email });
    } catch (error) {
      logger.error({ error }, 'Failed to get user by email');
      throw error;
    }
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    try {
      return await this.model.findByIdAndUpdate(id, user, { new: true });
    } catch (error) {
      logger.error({ error }, 'Failed to update user');
      throw error;
    }
  }

  async delete(id: string): Promise<User | null> {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      logger.error({ error }, 'Failed to delete user');
      throw error;
    }
  }
}
