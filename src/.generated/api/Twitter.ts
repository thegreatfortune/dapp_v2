// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class TwitterService {
  /** 发起推特授权, 强制登陆 GET /api/twitter/bindTwitterRequiredLogin */
  static async ApiTwitterBindTwitterRequiredLogin_GET(options?: { [key: string]: any }) {
    return request<Models.TwitterVo>({
      url: 'https://api.followfi.io/core/api/twitter/bindTwitterRequiredLogin',
      method: 'GET',
      ...(options || {}),
    });
  }
}
