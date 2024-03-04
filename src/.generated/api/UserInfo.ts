// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';
import { ChainAddressEnums } from '@/enums/chain';

export class UserInfoService {
  /** 获取当前登录用户的信息 GET /api/user/info/ */
  static async ApiUserInfo_GET(chainId: number, options?: { [key: string]: any }) {
    return request<Models.UserInfoVo1>({
      url: ChainAddressEnums[chainId].apiEndpoint + 'api/user/info/',
      method: 'GET',
      ...(options || {}),
    });
  }

  /** 整合的计分信息 GET /api/user/info/totalScoreInfo */
  static async ApiUserInfoTotalScoreInfo_GET(chainId: number, options?: { [key: string]: any }) {
    return request<Models.UserScore>({
      url: ChainAddressEnums[chainId].apiEndpoint + 'api/user/info/totalScoreInfo',
      method: 'GET',
      ...(options || {}),
    });
  }

  /**
   * get UserInfo with accessToken
   * @param options
   * @returns 
   */
  static async getUserInfo(chainId: number, options?: { [key: string]: any }) {
    return request<Models.UserInfoVo1>({
      url: ChainAddressEnums[chainId].apiEndpoint + 'api/user/info/',
      method: 'GET',
      ...options,
    });
  }

  /** 整合的计分信息 GET /api/user/info/totalScoreInfo */
  static async getUserScore(chainId: number, options?: { [key: string]: any }) {
    return request<Models.UserScore>({
      url: ChainAddressEnums[chainId].apiEndpoint + 'api/user/info/totalScoreInfo',
      method: 'GET',
      ...(options || {}),
    });
  }
}
