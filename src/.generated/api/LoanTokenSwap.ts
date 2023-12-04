// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class LoanTokenSwapService {
  /** pageInfo GET /api/loan/tokenSwap/pageInfo */
  static async ApiLoanTokenSwapPageInfo_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiLoanTokenSwapPageInfoGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.PageResult<Models.LoanTokenSwapVo>>({
      url: '/api/loan/tokenSwap/pageInfo',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}