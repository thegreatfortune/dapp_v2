// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class CreditAddressService {
  /** 获取地址的信用分 GET /api/creditAddress/query/address/creditScore */
  static async getCreditAddressQueryAddressCreditScore(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.getCreditAddressQueryAddressCreditScoreParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.CreditScoreVo>({
      url: '/api/creditAddress/query/address/creditScore',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }

  /** 固定抛出异常接口 GET /api/creditAddress/query/address/exception */
  static async getCreditAddressQueryAddressException(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.getCreditAddressQueryAddressExceptionParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.CreditScoreVo>({
      url: '/api/creditAddress/query/address/exception',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
