// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class TwitterService {
  /** 接收 Twitter 登录 信息 回调 GET /api/twitter/callBackTwitter/ */
  static async ApiTwitterCallBackTwitter_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiTwitterCallBackTwitterGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Record<string, any>>({
      url: '/api/twitter/callBackTwitter/',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }

  /** 发起  授权 GET /api/twitter/signin */
  static async ApiTwitterSignin_GET(options?: { [key: string]: any }) {
    return request<Models.TwitterVo>({
      url: '/api/twitter/signin',
      method: 'GET',
      ...(options || {}),
    });
  }

  /** 调试方法 GET /api/twitter/test/ */
  static async ApiTwitterTest_GET(options?: { [key: string]: any }) {
    return request<Record<string, any>>({
      url: '/api/twitter/test/',
      method: 'GET',
      ...(options || {}),
    });
  }
}
