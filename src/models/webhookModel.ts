import { Schema, Types, model } from 'mongoose';
import type { IWebhook } from '../types/webhook';

/** Webhook schema. */
export const WebhookSchema = new Schema<IWebhook>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: 'User'
    },
    url: { type: String, required: true },
    address: { type: String, required: true, unique: true, index: true },
    token: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

/** Webhook model. */
export const WebhookModel = model<IWebhook>('Webhook', WebhookSchema);
