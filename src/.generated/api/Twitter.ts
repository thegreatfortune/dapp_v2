// @ts-ignore
/* eslint-disable */
import { ChainAddressEnums } from '@/enums/chain';
import request from '../../utils/request';
import { Models } from './models';

export class TwitterService {
  /** 发起推特授权, 强制登陆 GET /api/twitter/bindTwitterRequiredLogin */
  static async ApiTwitterBindTwitterRequiredLogin_GET(chainId: number, options?: { [key: string]: any }) {
    return request<Models.TwitterVo>({
      url: ChainAddressEnums[chainId].apiEndpoint + 'api/twitter/bindTwitterRequiredLogin',
      method: 'GET',
      ...(options || {}),
    });
  }
}
