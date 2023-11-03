// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class CreditAddressService {
  /** 获取地址的信用分 GET /api/creditAddress/query/address/creditScore */
  static async CreditScore_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.CreditScoreGETParams,
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
  static async Exception_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ExceptionGETParams,
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
  static async Page_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.PageGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.PageResultCreditScoreVo>({
      url: '/api/creditAddress/query/address/page',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
