// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class MarketService {
  /** key交易信息在首页的展示 GET /api/market/homeInfo */
  static async ApiMarketHomeInfo_GET(options?: { [key: string]: any }) {
    return request<
      {
        loanId?: string;
        tradeId?: number;
        user?: {
          nickName?: string;
          address?: string;
          platformName?: string;
          pictureUrl?: string;
          inviteCode?: string;
          userId?: string;
        };
        price?: string;
        totalTradingCompleted?: string;
      }[]
    >({
      url: '/api/market/homeInfo',
      method: 'GET',
      ...(options || {}),
    });
  }

  /** 分页查询所有挂单 GET /api/market/pageInfo */
  static async ApiMarketPageInfo_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiMarketPageInfoGETParams,
    options?: { [key: string]: any },
  ) {
    return request<{
      records?: {
        loanId?: string;
        userId?: string;
        marketId?: number;
        tokenId?: number;
        state?: 'ToBeTraded' | 'Closed' | 'Canceled';
        amount?: number;
        remainingQuantity?: number;
        depositeTime?: number;
        price?: string;
        solder?: string;
      }[];
      total?: number;
      size?: number;
      current?: number;
    }>({
      url: '/api/market/pageInfo',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }

  /** 分页获取订单的聚合数据 GET /api/market/pageTradingLoan */
  static async ApiMarketPageTradingLoan_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiMarketPageTradingLoanGETParams,
    options?: { [key: string]: any },
  ) {
    return request<{
      records?: {
        loanId?: string;
        tradeId?: number;
        user?: {
          nickName?: string;
          address?: string;
          platformName?: string;
          pictureUrl?: string;
          inviteCode?: string;
          userId?: string;
        };
        price?: string;
        totalTradingCompleted?: string;
      }[];
      total?: number;
      size?: number;
      current?: number;
    }>({
      url: '/api/market/pageTradingLoan',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
