// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class MarketService {
  /** 分页查询所有挂单 GET /api/market/pageInfo */
  static async ApiMarketPageInfo_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiMarketPageInfoGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.PageResult<Models.TokenMarketVo>>({
      url: import.meta.env.VITE_API_ENDPOINT + 'api/market/pageInfo',
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
    return request<Models.PageResult<Models.MarketLoanVo>>({
      url: import.meta.env.VITE_API_ENDPOINT + 'api/market/pageTradingLoan',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
