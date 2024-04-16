import type { JSONSchemaType } from 'ajv';
import type { LoginBody, RegisterBody } from '../types/auth';

export const RegisterBodySchema: JSONSchemaType<RegisterBody> = {
  type: 'object',
  required: ['firstName', 'lastName', 'email', 'password'],
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string' }
  },
  additionalProperties: false
};

export const LoginBodySchema: JSONSchemaType<LoginBody> = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' }
  },
  additionalProperties: false
};
