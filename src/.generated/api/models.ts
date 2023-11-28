export namespace Models {
  export class ApiCreditAddressQueryAddressCreditScoreGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    id?: number = 0;
    /** 地址id */
    addressId?: number = 0;
    orderItemList?: Array<OrderItem> = [];
  }

  export class ApiCreditAddressQueryAddressExceptionGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    id?: number = 0;
    /** 地址id */
    addressId?: number = 0;
    orderItemList?: Array<OrderItem> = [];
  }

  export class ApiCreditAddressQueryAddressPageGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    id?: number = 0;
    /** 地址id */
    addressId?: number = 0;
    orderItemList?: Array<OrderItem> = [];
  }

  export class ApiLendingPageInfoGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    /** 贷方id */
    userId?: number = 0;
    /** 借方id */
    borrowUserId?: number = 0;
    /** 借款订单id */
    loanId?: number = 0;
    orderItemList?: Array<OrderItem> = [];
  }

  export class ApiLoanLoanInfoGETParams {
    tradeId?: number = 0;
  }

  export class ApiLoanPageLoanContractGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    /** 筛选出贷款金额大于该值的 */
    minLoanPrice?: string = undefined;
    /** 筛选出贷款金额小于该值的 */
    maxLoanPrice?: string = undefined;
    /** 借款用户id筛选 */
    borrowUserId?: string = undefined;
    /** 借款订单状态
Invalid :订单无效
Following :跟随中, 正在筹款
Trading :交易中, 已筹完
PaidOff :已还清, 借款订单结束
PaidButArrears :支付部分, 但是还有欠款
Blacklist :黑名单 */
    state?: string = undefined;
    /** 根据用户昵称筛选 */
    userNickname?: string = undefined;
    /** 根据绑定平台名称筛选 */
    bindPlatform?: string = undefined;
    /** 资金池地址 */
    capitalPoolContract?: string = undefined;
    /** 根据绑定平台昵称筛选
Twitter :推特 */
    platformType?: string = undefined;
    /** 根据借款订单名称筛选 */
    loanName?: string = undefined;
    orderItemList?: Array<OrderItem> = [];
    tradingFormTypeList?: Array<TradingFormType> = [];
  }

  export class ApiLoanTokenSwapPageInfoGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    /** 订单id */
    tradeId?: number = 0;
    orderItemList?: Array<OrderItem> = [];
  }

  export class ApiMarketPageInfoGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    loanId?: number = 0;
    /** 挂单后在链上对应的id */
    marketId?: number = 0;
    /** ToBeTraded :等待交易
Closed :订单完成
Canceled :订单取消 */
    state?: string = undefined;
    /** 出售者地址 */
    solder?: string = undefined;
    orderItemList?: Array<OrderItem> = [];
  }

  export class ApiMarketPageTradingLoanGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    /** 借款用户id筛选 */
    borrowUserId?: string = undefined;
    /** 借款订单状态
Invalid :订单无效
Following :跟随中, 正在筹款
Trading :交易中, 已筹完
PaidOff :已还清, 借款订单结束
PaidButArrears :支付部分, 但是还有欠款
Blacklist :黑名单 */
    state?: string = undefined;
    orderItemList?: Array<OrderItem> = [];
  }

  export class ApiRepayPlanPageInfoGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    tradeId?: number = 0;
    orderItemList?: Array<OrderItem> = [];
  }

  export class ApiTwitterCallBackTwitterGETParams {
    key?: string = undefined;
  }

  export class ApiUserInviteInvitedOrNotGETParams {
    address?: string = undefined;
  }

  export class AuthResult {
    success?: boolean = false;
    accessToken?: string = undefined;
  }

  export class CreditScoreVo {
    /** 分数 */
    score?: number = 0;
    /** 还款状态 */
    repaymentState?: 'UNPAID' | 'REPAID' | 'OVERDUE' | 'OVERDUE_REPAID' | 'OVERDUE_ARREARS' =
      undefined;
  }

  export class ISysWallet {}

  export class IUserWallet {}

  export class LendingLoanVo {
    /** 贷方id */
    userId?: number = 0;
    /** 借方id */
    borrowUserId?: number = 0;
    /** 借款订单id */
    loanId?: number = 0;
    loan?: SimpleLoanVo = undefined;
    /** 时间戳 */
    lendTime?: number = 0;
    /** 认购份数 */
    partAmount?: number = 0;
  }

  export class LoanConfirmParam {
    wallet?: ISysWallet = undefined;
    /** 借款订单id */
    tradeId?: number = 0;
    /** 名称 */
    loanName?: string = undefined;
    /** 简介 */
    loanIntro?: string = undefined;
    /** 借款订单展示用的图片url地址 */
    loanPicUrl?: string = undefined;
    /** 交易形式 */
    tradingFormType?: 'Empty' | 'SpotGoods' | 'Contract' = undefined;
    /** 交易平台 */
    tradingPlatformType?: 'Empty' | 'Uniswap' | 'GMX' = undefined;
    /** 展示的平台账号 */
    showPlatforms?: 'Twitter'[] = undefined;
    /** json: LIst<String> <br/> 配置指定资金用途只做某些代币交易对，系统提供主流交易代币的合约交易对给于选择，借方选择后，借款资金只能用来做指定交易对的交易 */
    transactionPairs?: string[] = undefined;
  }

  export class LoanContractVO {
    id?: number = 0;
    userId?: number = 0;
    /** 生效状态 */
    state?: 'Following' | 'Trading' | 'PaidOff' | 'Blacklist' = undefined;
    /** 合约地址 */
    contractAddress?: string = undefined;
    /** 获取接收贷款的地址 */
    receiveAddress?: string = undefined;
    /** 交易平台, 如果trading_form不指定则不需要指定这里 */
    tradingPlatform?: 'Empty' | 'Uniswap' | 'GMX' = undefined;
    /** 交易形式, 或者不指定 */
    tradingForm?: 'Empty' | 'SpotGoods' | 'Contract' = undefined;
    /** 借款合同名称 */
    loanName?: string = undefined;
    /** 贷款金额 */
    loanPrice?: number = 0;
    /** 利息 */
    interest?: number = 0;
    /** 借款周期(天) */
    loanCycle?: number = 0;
    /** 还款期数(比如180天分10期还, 每18天还一次) */
    periods?: number = 0;
    /** 可以选择让多人提供贷款资金，不填默认只能1个人提供贷款资金 */
    loanProvidePeople?: number = 0;
    /** 填写份数后该字段必填，要求最小达到多少份，借方用户才可以领取贷款资金，借款成功 */
    minSuccessfulQuantity?: number = 0;
    /** 筹集时间(天), <br/> 设定筹集借款的时间，时间下拉选择1,3,7,14,20天，提交申请开始计时，筹集结束时间未达到，已经筹集够，最后存入资金池的操作开始计时借款 */
    fundraisingDays?: number = 0;
    /** 设置分红比例，收益的分红，设置了分红比例合约到期自动按比例分发给贷方用户 */
    dividendRatio?: number = 0;
    /** json: LIst<String> <br/> 配置指定资金用途只做某些代币交易对，系统提供主流交易代币的合约交易对给于选择，借方选择后，借款资金只能用来做指定交易对的交易 */
    transactionPairs?: string[] = undefined;
    /** 是否展示绑定的平台用户, 如果不展示则是空数组, 里面是bind表的id */
    showPlatformUser?: number[] = undefined;
    /** 用途介绍 */
    usageIntro?: string = undefined;
    createDate?: string = undefined;
    showPlatformUserList?: PlatformUserVo[] = undefined;
  }

  export class LoanOrderVO {
    id?: number = 0;
    /** 借方id */
    userId?: number = 0;
    /** 在合约中的订单id */
    tradeId?: number = 0;
    /** 生效状态 */
    state?: 'Invalid' | 'Following' | 'Trading' | 'PaidOff' | 'PaidButArrears' | 'Blacklist' =
      undefined;
    /** 获取接收贷款的地址 */
    receiveAddress?: string = undefined;
    /** 交易平台, 如果trading_form不指定则不需要指定这里 */
    tradingPlatform?: 'Empty' | 'Uniswap' | 'GMX' = undefined;
    /** 交易形式, 或者不指定 */
    tradingForm?: 'Empty' | 'SpotGoods' | 'Contract' = undefined;
    /** 借款订单名称 */
    loanName?: string = undefined;
    /** 展示图片地址 */
    picUrl?: string = undefined;
    /** 贷款金额 */
    loanMoney?: number = 0;
    /** 利息 */
    interest?: number = 0;
    /** 总还款次数 */
    repayCount?: number = 0;
    /** 还款天数, 比如180天内还完 */
    periods?: number = 0;
    /** 目标份数 */
    goalCopies?: number = 0;
    /** 填写份数后该字段必填，要求最小达到多少份，借方用户才可以领取贷款资金，借款成功 */
    minGoalQuantity?: number = 0;
    /** 筹集时间(天), <br/> 设定筹集借款的时间，时间下拉选择1,3,7,14,20天，提交申请开始计时，筹集结束时间未达到，已经筹集够，最后存入资金池的操作开始计时借款 */
    collectEndTime?: number = 0;
    /** 设置分红比例，收益的分红，设置了分红比例合约到期自动按比例分发给贷方用户 */
    dividendRatio?: number = 0;
    /** json: LIst<String> <br/> 配置指定资金用途只做某些代币交易对，系统提供主流交易代币的合约交易对给于选择，借方选择后，借款资金只能用来做指定交易对的交易 */
    transactionPairs?: string[] = undefined;
    /** 是否展示绑定的平台用户, 如果不展示则是空数组, 里面是bind表的id */
    showPlatformUser?: number[] = undefined;
    /** 用途介绍 */
    usageIntro?: string = undefined;
    createDate?: string = undefined;
    /** 订单结束时间(清算时间) */
    endTime?: number = 0;
    isConfirm?: number = 0;
    showPlatformUserList?: PlatformUserVo[] = undefined;
    /** 已筹集份数 */
    collectCopies?: number = 0;
  }

  export class LoanTokenSwapVo {
    /** token地址 */
    tokenAddr?: string = undefined;
    amount?: number = 0;
    action?: 'Reduce' | 'Add' = undefined;
    createDate?: string = undefined;
  }

  export class LoginDto {
    address?: string = undefined;
    inviteCode?: string = undefined;
  }

  export class MarketLoanVo {
    tradeId?: number = 0;
    user?: UserInfoVo = undefined;
    /** 已交易总数 */
    totalTradingCompleted?: number = 0;
  }

  export class MetaMaskLoginParam {
    /** 钱包 */
    address?: string = undefined;
    /** 签名 */
    sign?: string = undefined;
  }

  export class MetaMaskVerifyParam {
    /** 钱包 */
    address?: string = undefined;
  }

  export class OauthCallbackTwitterGETParams {
    key?: string = undefined;
  }

  export class Object {}

  export class OrderItem {
    /** 列 需要进行排序的字段 */
    column?: string = undefined;
    /** 是否是asc排序 是否正序排列，默认 true */
    asc?: boolean = false;
  }

  export class PageResult<T> {
    /** 数据列表 */
    records?: T[] = undefined;
    /** 总数 */
    total?: number = 0;
    /** 每页数量 */
    size?: number = 0;
    /** 当前页 */
    current?: number = 0;
  }

  export enum PlatformType {
    'Twitter' = 'Twitter',
  }

  export class PlatformUserVo {
    userName?: string = undefined;
    platformType?: 'Twitter' = undefined;
  }

  export enum RepaymentState {
    'UNPAID' = 'UNPAID',
    'REPAID' = 'REPAID',
    'OVERDUE' = 'OVERDUE',
  }

  export class RepayPlanVo {
    /** 订单id */
    loanId?: string = undefined;
    /** 还款时间 */
    repayTime?: string = undefined;
    /** 0 == 未偿还 */
    state?: 'UNPAID' | 'REPAID' | 'OVERDUE' | 'OVERDUE_REPAID' | 'OVERDUE_ARREARS' = undefined;
    /** 表示是第几期偿还 */
    nowCount?: number = 0;
    /** 偿还token */
    repayFee?: number = 0;
  }

  export class Result<T> {
    code?: number = 0;
    message?: string = undefined;
    /** com.sszh.modules.credit.vo.CreditScoreVo */
    data?: T = undefined;
  }

  export class SimpleLoanVo {
    /** 在合约中的订单id */
    tradeId?: number = 0;
    /** 生效状态 */
    state?: 'Invalid' | 'Following' | 'Trading' | 'PaidOff' | 'PaidButArrears' | 'Blacklist' =
      undefined;
    /** 交易平台, 如果trading_form不指定则不需要指定这里 */
    tradingPlatform?: 'Empty' | 'Uniswap' | 'GMX' = undefined;
    /** 交易形式, 或者不指定 */
    tradingForm?: 'Empty' | 'SpotGoods' | 'Contract' = undefined;
    /** 借款订单名称 */
    loanName?: string = undefined;
    /** 展示图片地址 */
    picUrl?: string = undefined;
    /** 贷款金额 */
    loanMoney?: number = 0;
    /** 利息 */
    interest?: number = 0;
    /** 总还款次数 */
    repayCount?: number = 0;
    /** 还款天数, 比如180天内还完 */
    periods?: number = 0;
    /** 目标份数 */
    goalCopies?: number = 0;
    /** 设置分红比例，收益的分红，设置了分红比例合约到期自动按比例分发给贷方用户 */
    dividendRatio?: number = 0;
    /** 订单结束时间(清算时间) */
    endTime?: number = 0;
    /** 填写份数后该字段必填，要求最小达到多少份，借方用户才可以领取贷款资金，借款成功 */
    minGoalQuantity?: number = 0;
    /** 筹集时间(天), <br/> 设定筹集借款的时间，时间下拉选择1,3,7,14,20天，提交申请开始计时，筹集结束时间未达到，已经筹集够，最后存入资金池的操作开始计时借款 */
    collectEndTime?: number = 0;
  }

  export class TokenMarketVo {
    loanId?: number = 0;
    /** 挂单后在链上对应的id */
    marketId?: number = 0;
    /** 每次转移这个tokenId会改变 */
    tokenId?: number = 0;
    state?: 'ToBeTraded' | 'Closed' | 'Canceled' = undefined;
    /** token数量 */
    amount?: number = 0;
    /** 剩余数量 */
    remainingQuantity?: number = 0;
    /** 挂单时间 */
    depositeTime?: number = 0;
    /** U的数量 */
    price?: number = 0;
    /** 出售者地址 */
    solder?: string = undefined;
  }

  export enum TradingFormType {
    'Empty' = 'Empty',
    'SpotGoods' = 'SpotGoods',
    'Contract' = 'Contract',
  }

  export class TwitterVo {
    /** 请求url */
    authLink_uri?: string = undefined;
  }

  export class UserInfoVo {
    nickName?: string = undefined;
    address?: string = undefined;
    platformName?: string = undefined;
    pictureUrl?: string = undefined;
    userId?: number = 0;
  }
}
