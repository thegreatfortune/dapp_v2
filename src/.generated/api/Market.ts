// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';
import { chainAddressEnums } from '@/enums/chain';

export class MarketService {
  /** 分页查询所有挂单 GET /api/market/pageInfo */
  static async ApiMarketPageInfo_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    chainId: number,
    params: Models.ApiMarketPageInfoGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.IPageResult<Models.TokenMarketVo>>({
      url: chainAddressEnums[chainId].apiEndpoint + 'api/market/pageInfo',
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
    chainId: number,
    params: Models.ApiMarketPageTradingLoanGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.IPageResult<Models.MarketLoanVo>>({
      url: chainAddressEnums[chainId].apiEndpoint + 'api/market/pageTradingLoan',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
