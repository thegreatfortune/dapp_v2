// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class CreditRecordService {
  /** 分页查询信用分修改记录 GET /api/creditRecord/page */
  static async ApiCreditRecordPage_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiCreditRecordPageGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.PageResult<Models.CreditRecordVo>>({
      url: import.meta.env.VITE_CORE_API_ENDPOINT + 'api/creditRecord/page',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
