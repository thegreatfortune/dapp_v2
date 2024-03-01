/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/indent */
import request from '../utils/request'
import type { Models } from '../.generated/api/models'

// TODO 改 Model
/**
 * submit trade detail to backend api, backend will confirm it and save to DB.
 * @param body
 * @param options
 */
async function submitTradeDetail(
    body: Models.LoanConfirmParam,
    options?: { [key: string]: any },
) {
    return request<boolean>({
        url: import.meta.env.VITE_GENERAL_API_ENDPOINT + 'api/loan/confirm',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    })
}

/** 获取订单的详情信息 GET /api/loan/loanInfo */
async function getTradeDetail(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiLoanLoanInfoGETParams,
    options?: { [key: string]: any },
) {
    return request<Models.LoanOrderVO>({
        url: import.meta.env.VITE_GENERAL_API_ENDPOINT + 'api/loan/loanInfo',
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    })
}

/**
 * get Trade List
 * @param params
 * @param options
 */
async function getTradeList(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiLoanPageLoanContractGETParams,
    options?: { [key: string]: any },
) {
    return request<Models.PageResult<Models.LoanOrderVO>>({
        url: import.meta.env.VITE_GENERAL_API_ENDPOINT + 'api/loan/pageLoanContract',
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    })
}

export default {
    getTradeDetail,
    getTradeList,
    submitTradeDetail,
}
