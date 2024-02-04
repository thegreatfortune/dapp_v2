/* eslint-disable @typescript-eslint/indent */

/**
 * 将数值转换成可读的货币字符串
 * @param num number
 * @returns string
 */
export default function toCurrencyString(num: number): string {
    return Number(num.toFixed(2)).toLocaleString()
}
