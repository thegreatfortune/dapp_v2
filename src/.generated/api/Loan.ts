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
      url: '/api/loan/confirm',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }

  /** 获取不上链的详情信息 GET /api/loan/loanInfo/${param0} */
  static async ApiLoanLoanInfoByTradeId_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiLoanLoanInfoByTradeIdGETParams,
    options?: { [key: string]: any },
  ) {
    const { tradeId: param0, ...queryParams } = params;
    return request<Models.LoanOrderVO>({
      url: '/api/loan/loanInfo/${param0}',
      method: 'GET',
      params: { ...queryParams },
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
      url: '/api/loan/pageLoanContract',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
