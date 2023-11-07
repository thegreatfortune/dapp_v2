// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class MetamaskService {
  /** 获取nonce POST /api/metamask/getVerifyNonce */
  static async GetVerifyNonce_POST(
    body: Models.MetaMaskVerifyParam,
    options?: { [key: string]: any },
  ) {
    return request<string>({
      url: '/api/metamask/getVerifyNonce',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }

  /** 使用metamask登录 POST /api/metamask/login */
  static async Login_POST(body: Models.MetaMaskLoginParam, options?: { [key: string]: any }) {
    return request<Models.AuthResult>({
      url: '/api/metamask/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }
}