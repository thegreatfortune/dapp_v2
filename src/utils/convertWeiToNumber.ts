import BigNumber from 'bignumber.js'

/**
 *
 * 将Wei转换为可正常显示的数字
 *
 * @export
 * @param {string} wei
 * @param {number} [decimals]
 * @return {*}  {string}
 */
export function convertWeiToNumber(wei: string, decimals: number = 18): string {
  const weiBN = new BigNumber(wei)
  const divisor = new BigNumber(10).exponentiatedBy(decimals)
  const result = weiBN.dividedBy(divisor)

  return result.toString()
}
