// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';
import { chainAddressEnums } from '@/enums/chain';

export class PortfolioService {
  /** 查询订单的资产价值 GET /api/portfolio/loanPortfolio */
  static async ApiPortfolioLoanPortfolio_GET(chainId: number, options?: { [key: string]: any }) {
    return request<Models.Map<Models.UserPortfolioVo>>({
      url: chainAddressEnums[chainId].apiEndpoint + 'api/portfolio/loanPortfolio',
      method: 'GET',
      ...(options || {}),
    });
  }

  /** 查询当前登录用户历史资产价值 GET /api/portfolio/userTotalInfo */
  static async ApiPortfolioUserTotalInfo_GET(chainId: number, options?: { [key: string]: any }) {
    return request<Models.PageResult<Models.UserPortfolioVo>>({
      url: chainAddressEnums[chainId].apiEndpoint + 'api/portfolio/userTotalInfo',
      method: 'GET',
      ...(options || {}),
    });
  }
}
