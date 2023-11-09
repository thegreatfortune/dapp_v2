export class LoanRequisitionEditModel {
  /** 借款名称 */
  name: string | null = null

  /** 简介 */
  description: string | null = null

  /** 借款金额 */
  loanAmount: number = 0

  /** 借款利息 */
  interestRate: number = 0

  /** 借款周期 */
  loanTerm: number = 0

  /** 期数 */
  installmentCount: number = 0

  /** 借款份数 (可选) */
  loanParts?: number = 0

  /** 最小达成份数 (可选) */
  minCompletionParts?: number = 0

  /** 筹集时间 */
  fundraisingPeriod: number = 0

  /** 分红比例 (可选) */
  dividendPercentage?: number = 0
}
