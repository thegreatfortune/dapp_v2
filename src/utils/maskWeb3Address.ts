/**
 * Masked Wallet Address: 0x123**********************************890
 * Masked Contract Address: 0xabc**********************************f01
 *
 * @export
 * @param {string} address
 * @return {*}  {string}
 */
export function maskWeb3Address(address: string): string {
  if (!address || typeof address !== 'string')
    return 'Invalid address'

  const trimmedAddress = address.trim()
  const length = trimmedAddress.length

  if (length <= 8) {
    // If the address is too short, just return it as is
    return trimmedAddress
  }

  // Mask the address
  const maskedAddress
      = trimmedAddress.substring(0, 5) + '*'.repeat(length - 8) + trimmedAddress.substring(length - 3)

  return maskedAddress
}
