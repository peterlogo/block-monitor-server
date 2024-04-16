import type { JSONSchemaType } from 'ajv';
import type { UpdateUserBody } from '../types/user';

export const UpdateUserBodySchema: JSONSchemaType<UpdateUserBody> = {
  type: 'object',
  properties: {
    firstName: { type: 'string', nullable: true },
    lastName: { type: 'string', nullable: true },
    email: { type: 'string', nullable: true },
    password: { type: 'string', nullable: true }
  }
};
