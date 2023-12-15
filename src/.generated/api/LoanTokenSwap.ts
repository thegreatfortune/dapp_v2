// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class LoanTokenSwapService {
  /** 分页查询Token交换记录 GET /api/loan/tokenSwap/pageInfo */
  static async ApiLoanTokenSwapPageInfo_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiLoanTokenSwapPageInfoGETParams,
    options?: { [key: string]: any },
  ) {
    return request<{
      records?: {
        tokenAddr?: string;
        amount?: string;
        swapTokenAmount?: string;
        action?: 'Reduce' | 'Add';
        timestamp?: number;
        tokenInfo?: { symbol?: string; decimals?: number; chainType?: number; address?: string };
      }[];
      total?: number;
      size?: number;
      current?: number;
    }>({
      url: '/api/loan/tokenSwap/pageInfo',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
