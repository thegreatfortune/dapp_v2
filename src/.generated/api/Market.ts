// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class MarketService {
  /** 查询所有挂单 GET /api/market/pageInfo */
  static async ApiMarketPageInfo_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiMarketPageInfoGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.PageResult<Models.TokenMarketVo>>({
      url: '/api/market/pageInfo',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }

  /** 获取订单的聚合挂单数据 GET /api/market/pageTradingLoan */
  static async ApiMarketPageTradingLoan_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiMarketPageTradingLoanGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.PageResult<Models.MarketLoanVo>>({
      url: '/api/market/pageTradingLoan',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
