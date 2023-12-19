// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class PortfolioService {
  /** 查询订单的资产价值 GET /api/portfolio/loanPortfolio */
  static async ApiPortfolioLoanPortfolio_GET(options?: { [key: string]: any }) {
    return request<{ key?: { uPrice?: string; createDate?: string }[] }>({
      url: '/api/portfolio/loanPortfolio',
      method: 'GET',
      ...(options || {}),
    });
  }

  /** 查询当前登录用户历史资产价值 GET /api/portfolio/userTotalInfo */
  static async ApiPortfolioUserTotalInfo_GET(options?: { [key: string]: any }) {
    return request<{
      records?: { userId?: number; uPrice?: number; createDate?: string }[];
      total?: number;
      size?: number;
      current?: number;
    }>({
      url: '/api/portfolio/userTotalInfo',
      method: 'GET',
      ...(options || {}),
    });
  }
}