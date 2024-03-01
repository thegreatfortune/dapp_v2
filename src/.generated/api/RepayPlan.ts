// @ts-ignore
/* eslint-disable */
import { chainAddressEnums } from '@/enums/chain';
import request from '../../utils/request';
import { Models } from './models';

export class RepayPlanService {
  /** 分页查询还款计划 GET /api/repayPlan/pageInfo */
  static async ApiRepayPlanPageInfo_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    chainId: number,
    params: Models.ApiRepayPlanPageInfoGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.PageResult<Models.RepayPlanVo>>({
      url: chainAddressEnums[chainId].apiEndpoint + 'api/repayPlan/pageInfo',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
