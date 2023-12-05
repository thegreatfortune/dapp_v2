export class LoanRequisitionEditModel {
  /** 借款名称 */
  itemTitle: string = ''

  /** 简介 */
  description: string = ''

  imageUrl: string = '' // 最终上传的地址

  projectImagePreViewUrl: string | undefined

  projectImageFile: File | undefined

  /** 借款金额 Apply for Loan */
  applyLoan: number | undefined

  /** 借款周期 Cycle */
  cycle: number = 0

  /** 期数 Period */
  period: number | undefined

  /** 借款份数 (可选) */
  numberOfCopies: number | undefined

  /** 最小达成份数 (可选) */
  minimumRequiredCopies: number | undefined

  /** 借款利息 Interest */
  interest: number | undefined

  /** 分红比例 (可选) dividend */
  dividend: number | undefined

  /** 筹集时间 day */
  raisingTime: number | undefined

  /** 冗余 YES NO */
  designatedTransaction = true

  /** 交易形式 */
  tradingFormType: 'Empty' | 'SpotGoods' | 'Contract' = 'SpotGoods'
  /** 交易平台 */
  tradingPlatformType: 'Empty' | 'Uniswap' | 'GMX' = 'Uniswap'
  /** 展示的平台账号 */
  showPlatforms?: 'Twitter'[] = undefined
  /** json: LIst<String> <br/> 配置指定资金用途只做某些代币交易对，系统提供主流交易代币的合约交易对给于选择，借方选择后，借款资金只能用来做指定交易对的交易 */
  transactionPairs?: string[] = ['BTC']
}
