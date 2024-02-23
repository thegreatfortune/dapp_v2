// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class LoanService {
  /** 接受借款申请通知 <p>接受借款申请接口</p> POST /api/loan/confirm */
  static async ApiLoanConfirm_POST(
    body: Models.LoanConfirmParam,
    options?: { [key: string]: any },
  ) {
    return request<boolean>({
      url: import.meta.env.VITE_CORE_API_ENDPOINT + 'api/loan/confirm',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }

  /** 查询跟随中状态的订单信息 GET /api/loan/homeInfo */
  static async ApiLoanHomeInfo_GET(options?: { [key: string]: any }) {
    return request<Models.LoanOrderVO[]>({
      url: import.meta.env.VITE_CORE_API_ENDPOINT + 'api/loan/homeInfo',
      method: 'GET',
      ...(options || {}),
    });
  }

  /** 获取订单的详情信息 GET /api/loan/loanInfo */
  static async ApiLoanLoanInfo_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiLoanLoanInfoGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.LoanOrderVO>({
      url: import.meta.env.VITE_CORE_API_ENDPOINT + 'api/loan/loanInfo',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }

  /** 分页查询订单 GET /api/loan/pageLoanContract */
  static async ApiLoanPageLoanContract_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiLoanPageLoanContractGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.PageResult<Models.LoanOrderVO>>({
      url: import.meta.env.VITE_CORE_API_ENDPOINT + 'api/loan/pageLoanContract',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
