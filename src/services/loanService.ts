/* eslint-disable prefer-template */
/* eslint-disable @typescript-eslint/indent */
import request from '../utils/request'
import type { Models } from '../.generated/api/models'
import { chainAddressEnums } from '@/enums/chain'

/**
 * submit trade detail to backend api, backend will confirm it and save to DB.
 * @param chainId
 * @param body
 * @param options
 */
async function submitNewLoan(
    chainId: number,
    body: Models.ISubmitNewLoanParams,
    options?: { [key: string]: any },
) {
    return request<boolean>({
        url: chainAddressEnums[chainId].apiEndpoint + 'api/loans',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    })
}

/**
 * get loan detail infomation
 * @param chainId
 * @param params
 * @param options
 */
async function getLoanDetail(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    chainId: number,
    params: Models.IGetLoanDetailParams,
    options?: { [key: string]: any },
) {
    return request<Models.ILoanOrderVO>({
        url: chainAddressEnums[chainId].apiEndpoint + 'api/loans/' + params.tradeId,
        method: 'GET',
        // params: {
        //     ...params,
        // },
        ...(options || {}),
    })
}

/**
 * get loan List
 * @param chainId
 * @param params
 * @param options
 */
async function getLoanList(
    chainId: number,
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.IGetLoanListParams,
    options?: { [key: string]: any },
) {
    return request<Models.IPageResult<Models.LoanOrderVO>>({
        url: chainAddressEnums[chainId].apiEndpoint + 'api/loans',
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    })
}

export default {
    getLoanDetail,
    getLoanList,
    submitNewLoan,
}
