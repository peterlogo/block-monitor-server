import {
  ConfirmedSignatureInfo,
  ParsedTransactionWithMeta,
  PublicKey
} from '@solana/web3.js';
import { ISolanaService, SolanaServiceParams } from '../../types/solana';
import { logger } from '../logger';
import { searchNewSignatures } from './searchNewSignatures';

export class SolanaService implements ISolanaService {
  private connection: SolanaServiceParams['connection'];
  private addressStore: SolanaServiceParams['addressStore'];
  private signatureStore: SolanaServiceParams['signatureStore'];
  private webhookService: SolanaServiceParams['webhookService'];
  private subscriptions: Set<number>;

  constructor(params: SolanaServiceParams) {
    this.connection = params.connection;
    this.addressStore = params.addressStore;
    this.signatureStore = params.signatureStore;
    this.webhookService = params.webhookService;
    this.subscriptions = new Set();
  }

  /**
   * Subscribes to solana account changes.
   * @param address - solana address to subscribe to
   * @returns
   */
  private async subscribeToAccount(address: string): Promise<number> {
    try {
      const publicKey = new PublicKey(address);
      const subscription = this.connection.onAccountChange(
        publicKey,
        async () => this.handleAccountChange(address),
        'confirmed'
      );
      return subscription;
    } catch (error) {
      logger.error({ error }, 'Failed to subscribe to account');
      throw error;
    }
  }

  /**
   * Get transaction signatures for solana transaction.
   * @param publickey - solana address.
   * @returns
   */
  private async getSignatures(
    publickey: PublicKey
  ): Promise<ConfirmedSignatureInfo[] | undefined> {
    try {
      const signatures =
        await this.connection.getConfirmedSignaturesForAddress2(publickey);
      return signatures;
    } catch (error) {
      logger.error({ error }, 'Error getting signatures');
    }
  }

  /**
   * Gets the latest signature from the chain.
   * @param publicKey - solana public key
   * @returns {Promise<ConfirmedSignatureInfo>} - latest signature
   */
  private async getLatestSignatureFromChain(
    publicKey: PublicKey
  ): Promise<ConfirmedSignatureInfo | undefined> {
    try {
      const signatures = await this.getSignatures(publicKey);
      if (!signatures) {
        logger.info(`No signatures found for ${publicKey.toString()}`);
        return;
      }
      return signatures[0];
    } catch (error) {
      logger.error(
        { error, address: publicKey.toString() },
        'Failed to handle account change'
      );
      throw error;
    }
  }

  /**
   * Gets the transaction details for a given solana transaction signature.
   * @param signature - solana transaction signature.
   * @returns
   */
  private async getSolanaTransaction(
    signature: string
  ): Promise<ParsedTransactionWithMeta | null | undefined> {
    try {
      const transaction = await this.connection.getParsedTransaction(signature);
      return transaction;
    } catch (error) {
      logger.error({ error }, 'Error fetching transaction');
    }
  }

  /**
   * Processes the signatures and
   * sends the transaction details to the webhook.
   * @param address
   * @param signatures
   * @returns
   */
  private async processSignatures(
    address: string,
    signatures: ConfirmedSignatureInfo[]
  ): Promise<void> {
    if (!signatures.length || signatures.length === 0) return;

    const promises = signatures.map(async ({ signature }) => {
      const webhook = await this.webhookService.getByAddress(address);
      const transaction = await this.getSolanaTransaction(signature);

      if (!transaction || !webhook) return;

      await this.signatureStore.add({
        address,
        signature,
        blockTime: transaction.blockTime || 0
      });

      fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transaction)
      });
    });

    await Promise.all(promises);
  }

  /**
   * Handles the account change event.
   * @param address - solana address
   * @returns
   */
  private async handleAccountChange(address: string): Promise<void> {
    const publicKey = new PublicKey(address);
    const signatures = await this.getSignatures(publicKey);

    if (!signatures) return;

    // Get latest signature from the redis db
    const latestSignature = await this.signatureStore.get(address, 1);

    // Get the latest block time
    const latestBlockTime = parseInt(latestSignature[1]);
    const { index, value } = searchNewSignatures(latestBlockTime, signatures);

    // If the index or value is null, return
    if (index === null || value === null) return;

    const newSignatures = signatures.slice(0, index);

    await this.processSignatures(address, newSignatures);
  }

  isValidAddress(address: string): boolean {
    return PublicKey.isOnCurve(address);
  }

  /**
   * Adds a solana address to the subscription.
   * @param address
   */
  async addAddressToSubscription(address: string): Promise<void> {
    try {
      const publicKey = new PublicKey(address);
      const latestSignature = await this.getLatestSignatureFromChain(publicKey);
      const subscription = await this.subscribeToAccount(address);

      this.subscriptions.add(subscription); // Add subscription to set
      await this.addressStore.add(address); // Add address to store
      await this.signatureStore.add({
        address,
        signature: latestSignature?.signature || '',
        blockTime: latestSignature?.blockTime || 0
      }); // Add signature to store
    } catch (error) {
      logger.error({ error }, 'Failed to add address to subscription');
      throw error;
    }
  }

  /**
   * Monitors all the addresses in the store.
   */
  async monitorAddresses(): Promise<void> {
    try {
      const addresses = await this.addressStore.getAll();
      const addAddressPromises = addresses.map((address) =>
        this.addAddressToSubscription(address)
      );
      await Promise.all(addAddressPromises);
    } catch (error) {
      logger.error({ error }, 'Failed to monitor addresses');
      throw error;
    }
  }

  /**
   * Removes all the subscriptions.
   */
  async removeSubscriptions(): Promise<void> {
    try {
      const removeSubscriptionPromises = Array.from(this.subscriptions).map(
        (subscription) =>
          this.connection.removeAccountChangeListener(subscription)
      );
      await Promise.all(removeSubscriptionPromises);
    } catch (error) {
      logger.error({ error }, 'Failed to remove subscriptions');
      throw error;
    }
  }
}
