// @ts-ignore
/* eslint-disable */
import { ChainAddressEnums } from '@/enums/chain';
import request from '../../utils/request';
import { Models } from './models';

export class LoanTokenSwapService {
  /** 分页查询Token交换记录 GET /api/loan/tokenSwap/pageInfo */
  static async ApiLoanTokenSwapPageInfo_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    chainId: number,
    params: Models.ApiLoanTokenSwapPageInfoGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.IPageResult<Models.LoanTokenSwapVo>>({
      url: ChainAddressEnums[chainId].apiEndpoint + 'loan/tokenSwap/pageInfo',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
