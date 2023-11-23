// SPDX-License-Identifier: GPL-2.0-or-later

export interface IQuoter {
  // 返回给定精确输入交换的接收到的输出量，但不执行交换
  quoteExactInput(path: string, amountIn: bigint): Promise<bigint>

  // 返回给定精确输入但为单个池进行交换时接收到的输出量
  quoteExactInputSingle(
    tokenIn: string,
    tokenOut: string,
    fee: number,
    amountIn: bigint,
    sqrtPriceLimitX96: bigint
  ): Promise<bigint>

  // 返回给定精确输出交换的所需的输入量，但不执行交换
  quoteExactOutput(path: string, amountOut: bigint): Promise<bigint>

  // 返回给定精确输出但为单个池进行交换时所需的输入量
  quoteExactOutputSingle(
    tokenIn: string,
    tokenOut: string,
    fee: number,
    amountOut: bigint,
    sqrtPriceLimitX96: bigint
  ): Promise<bigint>
}
