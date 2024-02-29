// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class UserInfoService {
  /** 获取当前登录用户的信息 GET /api/user/info/ */
  static async ApiUserInfo_GET(options?: { [key: string]: any }) {
    return request<Models.UserInfoVo1>({
      url: import.meta.env.VITE_CORE_API_ENDPOINT + 'api/user/info/',
      method: 'GET',
      ...(options || {}),
    });
  }

  /** 整合的计分信息 GET /api/user/info/totalScoreInfo */
  static async ApiUserInfoTotalScoreInfo_GET(options?: { [key: string]: any }) {
    return request<Models.TotalScoreVo>({
      url: import.meta.env.VITE_CORE_API_ENDPOINT + 'api/user/info/totalScoreInfo',
      method: 'GET',
      ...(options || {}),
    });
  }

  /**
   * get UserInfo with accessToken
   * @param options
   * @returns 
   */
  static async getUserInfo(options?: { [key: string]: any }) {
    return request<Models.UserInfoVo1>({
      url: import.meta.env.VITE_CORE_API_ENDPOINT + 'api/user/info/',
      method: 'GET',
      ...(options || {}),
    });
  }
}
