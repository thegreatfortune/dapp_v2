// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class MetamaskService {
  /** 获取nonce POST /api/metamask/getVerifyNonce */
  static async ApiMetamaskGetVerifyNonce_POST(
    body: Models.MetaMaskVerifyParam,
    options?: { [key: string]: any },
  ) {
    return request<string>({
      url: 'https://api.followfi.io/core/api/metamask/getVerifyNonce',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }

  /** 使用metamask登录 POST /api/metamask/login */
  static async ApiMetamaskLogin_POST(
    body: Models.MetaMaskLoginParam,
    options?: { [key: string]: any },
  ) {
    return request<Models.AuthResult>({
      url: 'https://api.followfi.io/core/api/metamask/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }
}
