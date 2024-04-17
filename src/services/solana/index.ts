import { Connection } from '@solana/web3.js';
import { WebhookDao } from '../../dao';
import { redis } from '../../db';
import { WebhookModel } from '../../models';
import { WebhookService } from '../webhook';
import { AddressStore } from './addressStore';
import { SignatureStore } from './signatureStore';
import { config } from '../../config';
import { SolanaService } from './solanaService';

const addressStore = new AddressStore({ redis });
const signatureStore = new SignatureStore({ redis });

const webhookDao = new WebhookDao({ model: WebhookModel });
const webhookService = new WebhookService({ webhookDao });

const connection = new Connection(config.SOLANA_RPC_URL, {
  commitment: 'confirmed',
  wsEndpoint: config.SOLANA_WS_URL
});

export const solanaService = new SolanaService({
  connection,
  addressStore,
  signatureStore,
  webhookService
});
