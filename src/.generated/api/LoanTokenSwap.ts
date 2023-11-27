// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class LoanTokenSwapService {
  /** pageInfo GET /loan/tokenSwap/pageInfo */
  static async LoanTokenSwapPageInfo_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.LoanTokenSwapPageInfoGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.PageResult<Models.LoanTokenSwapVo>>({
      url: '/loan/tokenSwap/pageInfo',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
