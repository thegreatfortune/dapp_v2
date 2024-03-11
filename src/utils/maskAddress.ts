import { isAddress } from 'ethers'

/**
 * Masked Wallet Address: 0x123**********************************890
 * Masked Contract Address: 0xabc**********************************f01
 *
 * @export
 * @param {string} address
 * @return {*}  {string}
 */
export function maskAddress(address: string, count: number): string {
  if (!isAddress(address))
    return 'Invalid address'
  const maskedAddress
    = address.substring(0, count + 2) + '.'.repeat(4) + address.substring(address.length - count)
  return maskedAddress
}
