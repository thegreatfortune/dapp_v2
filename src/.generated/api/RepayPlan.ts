// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class RepayPlanService {
  /** pageInfo GET /pageInfo */
  static async PageInfo_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.PageInfoGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.PageResult<Models.RepayPlanVo>>({
      url: '/pageInfo',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
