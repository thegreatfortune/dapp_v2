// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';
import { chainAddressEnums } from '@/enums/chain';

export class LendingService {
  /** 分页查询自己的借出记录, 强制登录 GET /api/lending/pageInfo */
  static async ApiLendingPageInfo_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    chainId: number,
    params: Models.ApiLendingPageInfoGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.PageResult<Models.LendingLoanVo>>({
      url: chainAddressEnums[chainId].apiEndpoint + 'api/lending/pageInfo',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
