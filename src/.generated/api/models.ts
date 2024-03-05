export namespace Models {
  export class ApiBlacklistPageInfoGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    /** 排序字段, 规则: price=false,id=true
<p>true == asc, false == desc</p> */
    orderItemList?: string = undefined;
    userAddress?: string = undefined;
  }

  export class ApiCreditRecordPageGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    /** 排序字段, 规则: price=false,id=true
<p>true == asc, false == desc</p> */
    orderItemList?: string = undefined;
    userId?: number = 0;
  }

  export class ApiIntegralRecordPageGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    /** 排序字段, 规则: price=false,id=true
<p>true == asc, false == desc</p> */
    orderItemList?: string = undefined;
    userId?: number = 0;
  }

  export class ApiLendingPageInfoGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    /** 排序字段, 规则: price=false,id=true
<p>true == asc, false == desc</p> */
    orderItemList?: string = undefined;
    /** 贷方id */
    userId?: number = 0;
    /** 借方id */
    borrowUserId?: number = 0;
    /** 借款订单id */
    loanId?: number = 0;
  }

  export class ApiLoanLoanInfoGETParams {
    tradeId?: number = 0;
  }

  export interface IGetLoanDetailParams {
    tradeId: number
  }

  export class ApiLoanPageLoanContractGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    /** 排序字段, 规则: price=false,id=true
<p>true == asc, false == desc</p> */
    orderItemList?: string = undefined;
    /** 筛选出贷款金额大于该值的 */
    minLoanPrice?: string = undefined;
    /** 筛选出贷款金额小于该值的 */
    maxLoanPrice?: string = undefined;
    /** 交易形式, 风险评估筛选, 逗号拼接; example: SpotGoods,Contract */
    tradingFormTypeList?: string = undefined;
    /** 借款用户id筛选 */
    borrowUserId?: string = undefined;
    /** 借款订单状态
Invalid :订单无效
Following :跟随中, 正在筹款
Trading :交易中, 已筹完
PaidOff :已还清, 借款订单结束
PaidButArrears :支付部分, 但是还有欠款
CloseByUncollected :筹集不成功
Blacklist :黑名单
Fail :Fail
ClearingFail :清算失败 */
    state?: string = undefined;
    /** 逗号拼接, 见state选项 */
    stateList?: string = undefined;
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
  }

  export interface IGetLoanListParams {
    /** 分页查询页码 */
    page: number
    /** 分页查询每页数量 */
    limit: number
    /** 排序字段, 规则: price=false,id=true
<p>true == asc, false == desc</p> */
    orderItemList?: string
    /** 筛选出贷款金额大于该值的 */
    minLoanPrice?: string
    /** 筛选出贷款金额小于该值的 */
    maxLoanPrice?: string
    /** 交易形式, 风险评估筛选, 逗号拼接; example: Spot,Future */
    tradingFormTypeList?: string
    /** 借款用户id筛选 */
    borrowUserId?: string
    /** 借款订单状态
Invalid :订单无效
Following :跟随中, 正在筹款
Trading :交易中, 已筹完
PaidOff :已还清, 借款订单结束
PaidButArrears :支付部分, 但是还有欠款
CloseByUncollected :筹集不成功
Blacklist :黑名单
Fail :Fail
ClearingFail :清算失败 */
    state?: string
    /** 逗号拼接, 见state选项 */
    stateList?: string
    /** 根据用户昵称筛选 */
    userNickname?: string
    /** 根据绑定平台名称筛选 */
    bindPlatform?: string
    /** 资金池地址 */
    capitalPoolContract?: string
    /** 根据绑定平台昵称筛选
Twitter :推特 */
    platformType?: string
    /** 根据借款订单名称筛选 */
    loanName?: string
  }

  export class ApiLoanTokenSwapPageInfoGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    /** 排序字段, 规则: price=false,id=true
<p>true == asc, false == desc</p> */
    orderItemList?: string = undefined;
    /** 订单id */
    tradeId?: number = 0;
    loanId?: number = 0;
  }

  export class ApiMarketBalancePageMyFollowGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    /** 排序字段, 规则: price=false,id=true
<p>true == asc, false == desc</p> */
    orderItemList?: string = undefined;
    loanId?: number = 0;
    userId?: number = 0;
    /** 过滤掉低于这个值的结果 */
    minHoldAmount?: number = 0;
  }

  export class ApiMarketPageInfoGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    /** 排序字段, 规则: price=false,id=true
<p>true == asc, false == desc</p> */
    orderItemList?: string = undefined;
    loanId?: number = 0;
    /** 链上订单id */
    tradeId?: number = 0;
    /** 挂单后在链上对应的id */
    marketId?: number = 0;
    /** ToBeTraded :等待交易
Closed :订单完成
Canceled :订单取消 */
    state?: string = undefined;
    /** 出售者地址 */
    solder?: string = undefined;
  }

  export class ApiMarketPageTradingLoanGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    /** 排序字段, 规则: price=false,id=true
<p>true == asc, false == desc</p> */
    orderItemList?: string = undefined;
    /** 借款用户id筛选 */
    borrowUserId?: string = undefined;
    /** 借款订单状态
ToBeTraded :等待交易
Closed :订单完成
Canceled :订单取消 */
    state?: string = undefined;
    /** 交易形式 */
    tradingFormTypeStr?: string = undefined;
    /** 交易平台 */
    tradingPlatformTypeStr?: string = undefined;
  }

  export class ApiRepayPlanPageInfoGETParams {
    /** 分页查询页码 */
    page?: number = 0;
    /** 分页查询每页数量 */
    limit?: number = 0;
    /** 排序字段, 规则: price=false,id=true
<p>true == asc, false == desc</p> */
    orderItemList?: string = undefined;
    tradeId?: number = 0;
  }

  export class ApiUserInviteInvitedOrNotGETParams {
    address?: string = undefined;
  }

  export class ApiUserSetChainNetworkByIdPUTParams {
    id: string = '';
  }

  export class ApplicationContext { }

  export class AuthResult {
    success?: boolean = false;
    accessToken?: string = undefined;
  }

  export class BlacklistVo {
    userAddress?: string = undefined;
    userPictureUrl?: string = undefined;
    userNickname?: string = undefined;
  }

  export class CreditRecordVo {
    points?: number = 0;
    createDate?: string = undefined;
  }

  export class CreditScoreVo {
    /** 分数 */
    totalPoints?: number = 0;
    initialPoints?: number = 0;
    additionalPoints?: number = 0;
  }

  export class HttpStatusCode { }

  export class IChainToken { }

  export class IntegralVo {
    points?: number = 0;
    createDate?: string = undefined;
  }

  export class InviteByInviteCodeGETParams {
    /** 邀请码 */
    inviteCode: string = '';
  }

  export class ISysWallet { }

  export class IUserWallet { }

  export class key { }

  export class LendingLoanVo {
    /** 贷方id */
    userId?: string = undefined;
    /** 借方id */
    borrowUserId?: string = undefined;
    /** 借款订单id */
    loanId?: string = undefined;
    loan?: SimpleLoanVo = undefined;
    /** 时间戳 */
    lendTime?: number = 0;
    /** 认购份数 */
    partAmount?: number = 0;
    /** 持有的key */
    marketBalance?: MarketBalanceVo = undefined;
  }

  export interface ISubmitNewLoanParams {
    /** 借款订单id */
    tradeId: number
    /** 名称 */
    loanName: string
    /** 简介 */
    loanIntro: string
    /** 借款订单展示用的图片url地址 */
    loanPicUrl: string
    /** 交易形式 */
    tradingFormType: SpecifiedTradingType
    /** 交易平台 */
    tradingPlatformType: SpecifiedTradingPlatformType
    /** json: LIst<String> <br/> 配置指定资金用途只做某些代币交易对，系统提供主流交易代币的合约交易对给于选择，借方选择后，借款资金只能用来做指定交易对的交易 */
    transactionPairs: string[]
    /** 展示的平台账号 */
    showPlatforms?: 'Twitter'[]
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
    tradingPlatform?: SpecifiedTradingPlatformTypeEnum = undefined;
    /** 交易形式, 或者不指定 */
    tradingForm?: SpecifiedTradingTypeEnum = undefined;
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
    showPlatformUserList?: PlatformUserVo[] = undefined;
    /** 已筹集份数 */
    collectCopies?: number = 0;
    /** 借款单的用户信息 */
    userInfo?: UserInfoVo1 = undefined;
    /** 借方id */
    userId?: string = undefined;
    /** 在合约中的订单id */
    tradeId?: number = 0;
    /** 生效状态 */
    state?:
      | 'Invalid'
      | 'Following'
      | 'Trading'
      | 'PaidOff'
      | 'PaidButArrears'
      | 'CloseByUncollected'
      | 'Blacklist'
      | 'Fail'
      | 'ClearingFail' = undefined;
    /** 交易平台, 如果trading_form不指定则不需要指定这里 */
    tradingPlatform?: 'Empty' | 'Uniswap' | 'GMX' = undefined;
    /** 交易形式, 或者不指定 */
    tradingForm?: 'Empty' | 'SpotGoods' | 'Contract' = undefined;
    /** 借款订单名称 */
    loanName?: string = undefined;
    /** 展示图片地址 */
    picUrl?: string = undefined;
    /** 贷款金额 */
    loanMoney?: string = undefined;
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
    /** 用途介绍 */
    usageIntro?: string = undefined;
    createDate?: string = undefined;
    /** 订单结束时间(清算时间) */
    endTime?: number = 0;
    isConfirm?: number = 0;
  }

  export type LoanState = 'Invalid'
    | 'Following'
    | 'Trading'
    | 'PaidOff'
    | 'PaidButArrears'
    | 'CloseByUncollected'
    | 'Blacklist'
    | 'Fail'
    | 'ClearingFail'


  export interface ILoanOrderVO {
    showPlatformUserList?: PlatformUserVo[]
    /** 已筹集份数 */
    collectCopies: number
    /** 借款单的用户信息 */
    userInfo?: UserInfoVo1
    /** 借方id */
    userId: string
    /** 在合约中的订单id */
    tradeId: number
    /** 生效状态 */
    state?: LoanState
    /** 交易平台, 如果trading_form不指定则不需要指定这里 */
    tradingPlatform: SpecifiedTradingPlatformType
    /** 交易形式, 或者不指定 */
    tradingForm?: SpecifiedTradingType
    /** 借款订单名称 */
    loanName: string
    /** 展示图片地址 */
    picUrl?: string
    /** 贷款金额 */
    loanMoney: string
    /** 利息 */
    interest: number
    /** 总还款次数 */
    repayCount: number
    /** 还款天数, 比如180天内还完 */
    periods: number
    /** 目标份数 */
    goalCopies: number
    /** 填写份数后该字段必填，要求最小达到多少份，借方用户才可以领取贷款资金，借款成功 */
    minGoalQuantity: number
    /** 筹集时间(天), <br/> 设定筹集借款的时间，时间下拉选择1,3,7,14,20天，提交申请开始计时，筹集结束时间未达到，已经筹集够，最后存入资金池的操作开始计时借款 */
    collectEndTime: number
    /** 设置分红比例，收益的分红，设置了分红比例合约到期自动按比例分发给贷方用户 */
    dividendRatio: number
    /** json: LIst<String> <br/> 配置指定资金用途只做某些代币交易对，系统提供主流交易代币的合约交易对给于选择，借方选择后，借款资金只能用来做指定交易对的交易 */
    transactionPairs: string[];
    /** 用途介绍 */
    usageIntro?: string

    createDate: string
    /** 订单结束时间(清算时间) */
    endTime: number

    isConfirm: number
  }

  export class LoanTokenSwapVo {
    /** token地址 */
    tokenAddr?: string = undefined;
    amount?: string = undefined;
    swapTokenAmount?: string = undefined;
    action?: 'Reduce' | 'Add' = undefined;
    timestamp?: number = 0;
    tokenInfo?: SimpleTokenInfoVo = undefined;
  }

  export class Locale { }

  export class Log { }

  export class LoginDto {
    address?: string = undefined;
    inviteCode?: string = undefined;
  }

  export class Map<T> {
    key?: { uPrice?: string; createDate?: number }[] = undefined;
    data: any;
  }

  export class MarketBalanceVo {
    /** tokenId */
    tokenId?: number = 0;
    /** 持有数量 */
    amount?: number = 0;
  }

  export class MarketLoanVo {
    loanId?: string = undefined;
    loan?: LoanOrderVO = undefined;
    tradeId?: number = 0;
    /** 借款单的用户信息 */
    user?: UserInfoVo1 = undefined;
    /** 展示的最低价 */
    price?: string = undefined;
    /** 已交易总数 */
    totalTradingCompleted?: string = undefined;
  }

  export class MessageSource { }

  export class MessageSourceAccessor {
    messageSource?: MessageSource = undefined;
    defaultLocale?: Locale = undefined;
  }

  export interface MetaMaskLoginParam {
    /** 钱包地址 */
    address: string;
    /** 签名 */
    sign: string;

    /** 原始数据 */
    rawMessage: string
    /** 用户邀请码 */
    inviteCode?: string;
  }

  export class MetaMaskVerifyParam {
    /** 钱包 */
    address?: string = undefined;
  }

  export class MyFollowVo {
    /** 借方id */
    borrowUserId?: string = undefined;
    /** 借款订单id */
    loanId?: string = undefined;
    loan?: SimpleLoanVo = undefined;
    /** 时间戳 */
    lendTime?: number = 0;
    /** 持有的key */
    marketBalance?: MarketBalanceVo = undefined;
  }

  export class OauthCallbackTwitterGETParams {
    key?: string = undefined;
  }

  export class Object { }

  export class OrderItem {
    /** 列 需要进行排序的字段 */
    column?: string = undefined;
    /** 是否是asc排序 是否正序排列，默认 true */
    asc?: boolean = false;
  }

  export interface IPageResult<T> {
    /** 数据列表 */
    records: T[]
    /** 总数 */
    total: number
    /** 每页数量 */
    size: number
    /** 当前页 */
    current: number
  }

  export enum PlatformType {
    'Twitter' = 'Twitter',
  }

  export class PlatformUserVo {
    userName?: string = undefined;
    platformType?: 'Twitter' = undefined;
  }

  export class RedirectView {
    /** Logger that is available to subclasses. */
    logger?: Log = undefined;
    /** ApplicationContext this object runs in. */
    applicationContext?: ApplicationContext = undefined;
    /** MessageSourceAccessor for easy message access. */
    messageSourceAccessor?: MessageSourceAccessor = undefined;
    servletContext?: ServletContext = undefined;
    contentType?: string = undefined;
    requestContextAttribute?: string = undefined;
    staticAttributes?: Map<Models.Object> = undefined;
    exposePathVariables?: boolean = false;
    exposeContextBeansAsAttributes?: boolean = false;
    exposedContextBeanNames?: string[] = undefined;
    beanName?: string = undefined;
    url?: string = undefined;
    contextRelative?: boolean = false;
    http10Compatible?: boolean = false;
    exposeModelAttributes?: boolean = false;
    encodingScheme?: string = undefined;
    statusCode?: HttpStatusCode = undefined;
    expandUriTemplateVariables?: boolean = false;
    propagateQueryParams?: boolean = false;
    hosts?: string[] = undefined;
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
    repayFee?: string = undefined;
  }

  export class Result<T> {
    code?: number = 0;
    message?: string = undefined;
    data?: T = undefined;
  }

  export class ServletContext { }

  export class SimpleFileVo {
    url?: string = undefined;
  }

  export class SimpleLoanVo {
    /** 在合约中的订单id */
    tradeId?: number = 0;
    /** 生效状态 */
    state?:
      | 'Invalid'
      | 'Following'
      | 'Trading'
      | 'PaidOff'
      | 'PaidButArrears'
      | 'CloseByUncollected'
      | 'Blacklist'
      | 'Fail'
      | 'ClearingFail' = undefined;
    /** 交易平台, 如果trading_form不指定则不需要指定这里 */
    tradingPlatform?: SpecifiedTradingPlatformTypeEnum = undefined;
    /** 交易形式, 或者不指定 */
    tradingForm?: SpecifiedTradingTypeEnum = undefined;
    /** 借款订单名称 */
    loanName?: string = undefined;
    /** 展示图片地址 */
    picUrl?: string = undefined;
    /** 贷款金额 */
    loanMoney?: string = undefined;
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
    /** 已筹集份数 */
    collectCopies?: number = 0;
    /** 订单结束时间(清算时间) */
    endTime?: number = 0;
    /** 填写份数后该字段必填，要求最小达到多少份，借方用户才可以领取贷款资金，借款成功 */
    minGoalQuantity?: number = 0;
    /** 筹集时间(天), <br/> 设定筹集借款的时间，时间下拉选择1,3,7,14,20天，提交申请开始计时，筹集结束时间未达到，已经筹集够，最后存入资金池的操作开始计时借款 */
    collectEndTime?: number = 0;
  }

  export class SimpleTokenInfoVo {
    /** 代币标识 */
    symbol?: string = undefined;
    /** 小数, 10**decimals */
    decimals?: number = 0;
    /** 是什么链 */
    chainType?: number = 0;
    address?: string = undefined;
  }

  export class TokenMarketVo {
    loanId?: string = undefined;
    userId?: string = undefined;
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
    price?: string = undefined;
    /** 出售者地址 */
    solder?: string = undefined;
    /** 借款单的用户信息 */
    userInfo?: UserInfoVo1 = undefined;
  }

  export class UserScore {
    /** com.sszh.modules.score.integral.IntegralVo */
    integral?: IntegralVo = undefined;
    credit?: CreditScoreVo = undefined;
  }

  export enum SpecifiedTradingTypeEnum {
    Other = 'Other',
    Spot = 'Spot',
    Future = 'Future',
  }

  export enum SpecifiedTradingPlatformTypeEnum {
    Other = 'Other',
    Uniswap = 'Uniswap',
    GMX = 'GMX',
  }

  export type SpecifiedTradingType = 'Spot' | 'Future' | 'Other'

  export type SpecifiedTradingPlatformType = 'Uniswap' | 'GMX' | 'Other'

  export class TwitterVo {
    /** 请求url */
    authLink_uri?: string = undefined;
  }

  export class UserInfoVo {
    userId?: number = 0;
    nickName?: string = undefined;
    walletId?: number = 0;
    address?: string = undefined;
  }

  export class UserInfoVo1 {
    /** 昵称 */
    nickName?: string = undefined;
    /** 地址 */
    address?: string = undefined;
    /** 推特平台名称 */
    platformName?: string = undefined;
    /** 头像 */
    pictureUrl?: string = undefined;
    /** 邀请码 */
    inviteCode?: string = undefined;

    userId?: string = undefined;
    /** 信用分 */
    creditScore?: number = 0;
  }

  export interface IUserInfo {
    userId?: string

    address: string

    nickName?: string

    platformName?: string

    pictureUrl?: string

    inviteCode?: string

    creditScore?: number
  }


  export class UserPortfolioVo {
    uPrice: string = '0';
    createDate: number = 0;
    // uPrice?: string = undefined;
    // createDate?: number = 0;
  }

  export interface ITokenState {
    address: string
    name: string
    decimals: number
    balance: string
    ratio: string
    usd: string
    icon: string
  }

}
