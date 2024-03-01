// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';
import { chainAddressEnums } from '@/enums/chain';

export class TwitterNotifyControllerService {
  /** oauth GET /oauth/callback/twitter */
  static async OauthCallbackTwitter_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    chainId: number,
    params: Models.OauthCallbackTwitterGETParams,
    options?: { [key: string]: any },
  ) {
    return request<Models.RedirectView>({
      url: chainAddressEnums[chainId].apiEndpoint + 'oauth/callback/twitter',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
