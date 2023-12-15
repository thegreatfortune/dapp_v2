// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class RepayPlanService {
  /** 分页查询还款计划 GET /api/repayPlan/pageInfo */
  static async ApiRepayPlanPageInfo_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiRepayPlanPageInfoGETParams,
    options?: { [key: string]: any },
  ) {
    return request<{
      records?: {
        loanId?: string;
        repayTime?: string;
        state?: 'UNPAID' | 'REPAID' | 'OVERDUE' | 'OVERDUE_REPAID' | 'OVERDUE_ARREARS';
        nowCount?: number;
        repayFee?: string;
      }[];
      total?: number;
      size?: number;
      current?: number;
    }>({
      url: '/api/repayPlan/pageInfo',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
