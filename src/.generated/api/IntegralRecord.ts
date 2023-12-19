// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class IntegralRecordService {
  /** 分页查询积分修改记录 GET /api/integralRecord/page */
  static async ApiIntegralRecordPage_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiIntegralRecordPageGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.PageResult<Models.IntegralVo>>({
      url: '/api/integralRecord/page',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}