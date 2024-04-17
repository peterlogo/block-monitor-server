import type { ConfirmedSignatureInfo } from '@solana/web3.js';

/**
 * Searches for new signatures in the chain.
 * Uses binary search to find the latest signature.
 * Helper function for SolanaService.
 * @param latestBlockTime - latest block time
 * @param data - array of confirmed signatures.
 * @returns
 */
export function searchNewSignatures(
  latestBlockTime: number,
  data: ConfirmedSignatureInfo[]
): { index: number | null; value: ConfirmedSignatureInfo | null } {
  let start = 0;
  let end = data.length - 1;

  // Iterate while the start value is not equal to the end value.
  while (start <= end) {
    // Find the mid index
    const mid = Math.floor((start + end) / 2);

    const { blockTime } = data[mid];

    if (blockTime !== null && blockTime !== undefined) {
      if (blockTime === latestBlockTime) {
        // If the element is present at mid, return value with index.
        return {
          index: mid,
          value: data[mid]
        };
      }

      // Else look at the left and right values.
      if (blockTime > latestBlockTime) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    } else {
      return {
        index: null,
        value: null
      };
    }
  }

  return {
    index: null,
    value: null
  };
}
