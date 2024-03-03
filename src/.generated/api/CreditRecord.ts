// @ts-ignore
/* eslint-disable */
import { chainAddressEnums } from '@/enums/chain';
import request from '../../utils/request';
import { Models } from './models';

export class CreditRecordService {
  /** 分页查询信用分修改记录 GET /api/creditRecord/page */
  static async ApiCreditRecordPage_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    chainId: number,
    params: Models.ApiCreditRecordPageGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.IPageResult<Models.CreditRecordVo>>({
      url: chainAddressEnums[chainId].apiEndpoint + 'api/creditRecord/page',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
