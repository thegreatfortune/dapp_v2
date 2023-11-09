import { TimePeriod } from './TimePeriod'

export class LoanRequisition {
  /** 交易订单id(ERC3525对应槽值) */
  tradeId: number = 0
  /** 订单是否清算（非0即清算） */
  ifClearing: number = 0
  /** 时间段选择(10,20,30,60,90,180) */
  timePeriod: TimePeriod = TimePeriod.Ten
  /** 还款次数 */
  repayTimes: number = 0
  /** 已经还款的次数 */
  alreadyRepay: number = 0
  /** 收益比(/100)例如1的话就是1/100,1% */
  profitRate: number = 0
  /** 分红比(0~100)例如1的话就是1/100,1% */
  shareRate: number = 0
  /** 目标份数 */
  goalCopies: number = 0
  /** 最小执行份数 */
  minStock: number = 0
  /** 实际参与的总份数 */
  actualCopies: number = 0
  /** 筹集结束时间 */
  collectEndTime: bigint = BigInt(0)
  /** 结束时间 */
  endTime: bigint = BigInt(0)
  /** 预期借款数量 */
  money: bigint = BigInt(0)
  /** 已经收集的money */
  alreadyCollectMoney: bigint = BigInt(0)
  /** 最后清算记录剩余的money */
  surplusMoney: bigint = BigInt(0)
  /** 已经还款的数量 */
  alreadyRepayMoney: bigint = BigInt(0)
  /** 到期结束分红的money */
  endMoney: bigint = BigInt(0)
  /** 借款人 */
  borrower: string = ''
}
