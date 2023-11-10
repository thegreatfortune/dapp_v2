export class LoanRequisitionEditModel {
  /** 借款名称 */
  loanName: string | null = null

  /** 简介 */
  description: string | null = null

  imageUrl?: string

  /** 借款金额 Apply for Loan */
  loanAmount: number = 0

  /** 借款利息 Interest */
  interestRate: number = 0

  /** 借款周期 Cycle */
  loanCycle: number = 0

  /** 期数 Period */
  installmentCount: number = 0

  /** 借款份数 (可选) */
  loanParts?: number = 0

  /** 最小达成份数 (可选) */
  minCompletionParts?: number = 0

  /** 分红比例 (可选) dividend */
  dividendPercentage?: number = 0

  /** 筹集时间 */
  fundraisingTime: number = 0
}
