export class LoanRequisitionEditModel {
  /** 借款名称 */
  itemTitle: string | null = null

  /** 简介 */
  description: string | null = null

  imageUrl?: string

  /** 借款金额 Apply for Loan */
  applyLoan: number = 0

  /** 借款周期 Cycle */
  cycle: number = 0

  /** 期数 Period */
  period: number = 0

  /** 借款份数 (可选) */
  numberOfCopies: number = 0

  /** 最小达成份数 (可选) */
  minimumRequiredCopies: number = 0

  /** 借款利息 Interest */
  interest: number = 0

  /** 分红比例 (可选) dividend */
  dividend: number = 0

  /** 筹集时间 day */
  raisingTime: number = 0
}
