// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class CreditAddressService {
  /** 获取地址的信用分 GET /api/creditAddress/query/address/creditScore */
  static async ApiCreditAddressQueryAddressCreditScore_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiCreditAddressQueryAddressCreditScoreGETParams,
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
  static async ApiCreditAddressQueryAddressException_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiCreditAddressQueryAddressExceptionGETParams,
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

  /** queryPage GET /api/creditAddress/query/address/page */
  static async ApiCreditAddressQueryAddressPage_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiCreditAddressQueryAddressPageGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.PageResult<Models.CreditScoreVo>>({
      url: '/api/creditAddress/query/address/page',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
