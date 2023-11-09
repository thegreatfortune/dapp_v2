// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class LoanService {
  /** 确认合约是否正确上链 POST /api/loan/confirm */
  static async LoanConfirm_POST(body: Models.LoanConfirmParam, options?: { [key: string]: any }) {
    return request<boolean>({
      url: '/api/loan/confirm',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }

  /** pageLoanContract GET /api/loan/page */
  static async LoanPage_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.LoanPageGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.PageResult<Models.LoanContractVO>>({
      url: '/api/loan/page',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
