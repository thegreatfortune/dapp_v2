// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class LoanService {
  /** 接受借款申请通知 <p>接受借款申请接口</p> POST /api/loan/confirm */
  static async ApiLoanConfirm_POST(
    body: {
      wallet?: Record<string, any>;
      /** 借款订单id */
      tradeId?: number;
      /** 名称 */
      loanName: string;
      /** 简介 */
      loanIntro?: string;
      /** 借款订单展示用的图片url地址 */
      loanPicUrl?: string;
      /** 交易形式 */
      tradingFormType: 'Empty' | 'SpotGoods' | 'Contract';
      /** 交易平台 */
      tradingPlatformType: 'Empty' | 'Uniswap' | 'GMX';
      /** 展示的平台账号 */
      showPlatforms?: 'Twitter'[];
      /** json: LIst<String> <br/> 配置指定资金用途只做某些代币交易对，系统提供主流交易代币的合约交易对给于选择，借方选择后，借款资金只能用来做指定交易对的交易 */
      transactionPairs?: string[];
    },
    options?: { [key: string]: any },
  ) {
    return request<boolean>({
      url: '/api/loan/confirm',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }

  /** 订单信息在首页的展示 GET /api/loan/homeInfo */
  static async ApiLoanHomeInfo_GET(options?: { [key: string]: any }) {
    return request<
      {
        showPlatformUserList?: { userName?: string; platformType?: 'Twitter' }[];
        collectCopies?: number;
        userInfo?: {
          nickName?: string;
          address?: string;
          platformName?: string;
          pictureUrl?: string;
          inviteCode?: string;
          userId?: string;
        };
        userId?: string;
        tradeId?: number;
        state?: 'Invalid' | 'Following' | 'Trading' | 'PaidOff' | 'PaidButArrears' | 'Blacklist';
        tradingPlatform?: 'Empty' | 'Uniswap' | 'GMX';
        tradingForm?: 'Empty' | 'SpotGoods' | 'Contract';
        loanName?: string;
        picUrl?: string;
        loanMoney?: string;
        interest?: number;
        repayCount?: number;
        periods?: number;
        goalCopies?: number;
        minGoalQuantity?: number;
        collectEndTime?: number;
        dividendRatio?: number;
        transactionPairs?: string[];
        usageIntro?: string;
        createDate?: string;
        endTime?: number;
        isConfirm?: number;
      }[]
    >({
      url: '/api/loan/homeInfo',
      method: 'GET',
      ...(options || {}),
    });
  }

  /** 获取订单的详情信息 GET /api/loan/loanInfo */
  static async ApiLoanLoanInfo_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiLoanLoanInfoGETParams,
    options?: { [key: string]: any },
  ) {
    return request<{
      showPlatformUserList?: { userName?: string; platformType?: 'Twitter' }[];
      collectCopies?: number;
      userInfo?: {
        nickName?: string;
        address?: string;
        platformName?: string;
        pictureUrl?: string;
        inviteCode?: string;
        userId?: string;
      };
      userId?: string;
      tradeId?: number;
      state?: 'Invalid' | 'Following' | 'Trading' | 'PaidOff' | 'PaidButArrears' | 'Blacklist';
      tradingPlatform?: 'Empty' | 'Uniswap' | 'GMX';
      tradingForm?: 'Empty' | 'SpotGoods' | 'Contract';
      loanName?: string;
      picUrl?: string;
      loanMoney?: string;
      interest?: number;
      repayCount?: number;
      periods?: number;
      goalCopies?: number;
      minGoalQuantity?: number;
      collectEndTime?: number;
      dividendRatio?: number;
      transactionPairs?: string[];
      usageIntro?: string;
      createDate?: string;
      endTime?: number;
      isConfirm?: number;
    }>({
      url: '/api/loan/loanInfo',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }

  /** 分页查询订单 GET /api/loan/pageLoanContract */
  static async ApiLoanPageLoanContract_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiLoanPageLoanContractGETParams,
    options?: { [key: string]: any },
  ) {
    return request<{
      records?: {
        showPlatformUserList?: { userName?: string; platformType?: 'Twitter' }[];
        collectCopies?: number;
        userInfo?: {
          nickName?: string;
          address?: string;
          platformName?: string;
          pictureUrl?: string;
          inviteCode?: string;
          userId?: string;
        };
        userId?: string;
        tradeId?: number;
        state?: 'Invalid' | 'Following' | 'Trading' | 'PaidOff' | 'PaidButArrears' | 'Blacklist';
        tradingPlatform?: 'Empty' | 'Uniswap' | 'GMX';
        tradingForm?: 'Empty' | 'SpotGoods' | 'Contract';
        loanName?: string;
        picUrl?: string;
        loanMoney?: string;
        interest?: number;
        repayCount?: number;
        periods?: number;
        goalCopies?: number;
        minGoalQuantity?: number;
        collectEndTime?: number;
        dividendRatio?: number;
        transactionPairs?: string[];
        usageIntro?: string;
        createDate?: string;
        endTime?: number;
        isConfirm?: number;
      }[];
      total?: number;
      size?: number;
      current?: number;
    }>({
      url: '/api/loan/pageLoanContract',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
