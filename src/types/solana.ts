import { Connection } from '@solana/web3.js';
import { IWebhookService } from './webhook';

export interface IAddressStore {
  add(address: string): Promise<void>;
  getAll(): Promise<string[]>;
  remove(address: string): Promise<void>;
}

export type SignatureParams = {
  address: string;
  signature: string;
  blockTime: number;
};

export interface ISignatureStore {
  add(params: SignatureParams): Promise<void>;
  get(address: string, count: number): Promise<string[]>;
  remove(address: string): Promise<void>;
}

export type SolanaServiceParams = {
  connection: Connection;
  addressStore: IAddressStore;
  signatureStore: ISignatureStore;
  webhookService: IWebhookService;
};

export interface ISolanaService {
  isValidAddress(address: string): boolean;
  addAddressToSubscription(address: string): Promise<void>;
  monitorAddresses(): Promise<void>;
  removeSubscriptions(): Promise<void>;
}
