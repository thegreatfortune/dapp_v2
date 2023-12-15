// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class LendingService {
  /** 分页查询自己的借出记录, 强制登录 GET /api/lending/pageInfo */
  static async ApiLendingPageInfo_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiLendingPageInfoGETParams,
    options?: { [key: string]: any },
  ) {
    return request<{
      records?: {
        userId?: string;
        borrowUserId?: string;
        loanId?: string;
        loan?: {
          tradeId?: number;
          state?: 'Invalid' | 'Following' | 'Trading' | 'PaidOff' | 'PaidButArrears' | 'Blacklist';
          tradingPlatform?: 'Empty' | 'Uniswap' | 'GMX';
          tradingForm?: 'Empty' | 'SpotGoods' | 'Contract';
          loanName?: string;
          picUrl?: string;
          loanMoney?: string;
          interest?: number;
          repayCount?: number;
          periods?: number;
          goalCopies?: number;
          dividendRatio?: number;
          collectCopies?: number;
          endTime?: number;
          minGoalQuantity?: number;
          collectEndTime?: number;
        };
        lendTime?: number;
        partAmount?: number;
        marketBalance?: { tokenId?: number; amount?: number };
      }[];
      total?: number;
      size?: number;
      current?: number;
    }>({
      url: '/api/lending/pageInfo',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
