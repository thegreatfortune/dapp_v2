// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';
import { ChainAddressEnums } from '@/enums/chain';

export class LoanService {
  /** 接受借款申请通知 <p>接受借款申请接口</p> POST /api/loan/confirm */
  static async ApiLoanConfirm_POST(
    chainId: number,
    body: Models.ISubmitNewLoanParams,
    options?: { [key: string]: any },
  ) {
    return request<boolean>({
      url: ChainAddressEnums[chainId].apiEndpoint + 'api/loans',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }

  /** 查询跟随中状态的订单信息 GET /api/loan/homeInfo */
  static async ApiLoanHomeInfo_GET(chainId: number, options?: { [key: string]: any }) {
    return request<Models.LoanOrderVO[]>({
      url: ChainAddressEnums[chainId].apiEndpoint + 'api/loans/follows',
      method: 'GET',
      ...(options || {}),
    });
  }

  /** 获取订单的详情信息 GET /api/loan/loanInfo */
  static async ApiLoanLoanInfo_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    chainId: number,
    params: Models.ApiLoanLoanInfoGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.LoanOrderVO>({
      url: ChainAddressEnums[chainId].apiEndpoint + 'api/loans/' + params.tradeId,
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
    chainId: number,
    params: Models.ApiLoanPageLoanContractGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.IPageResult<Models.LoanOrderVO>>({
      // url: ChainAddressEnums[chainId].apiEndpoint + 'api/loans/pageLoanContract',
      url: ChainAddressEnums[chainId].apiEndpoint + 'api/loans',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
