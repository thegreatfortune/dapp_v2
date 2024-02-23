// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class MarketBalanceService {
  /** 查询我的跟随 GET /api/market/balance/pageMyFollow */
  static async ApiMarketBalancePageMyFollow_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiMarketBalancePageMyFollowGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.PageResult<Models.MyFollowVo>>({
      url: import.meta.env.VITE_API_ENDPOINT + 'api/market/balance/pageMyFollow',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
