// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';
import { chainAddressEnums } from '@/enums/chain';

export class UserService {
  /** 用户登录 POST /api/user/login */
  static async ApiUserLogin_POST(chainId: number, body: Models.LoginDto, options?: { [key: string]: any }) {
    return request<Models.AuthResult>({
      url: chainAddressEnums[chainId].apiEndpoint + 'api/user/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }

  /** 用户登出 PUT /api/user/logOut */
  static async ApiUserLogOut_PUT(chainId: number, options?: { [key: string]: any }) {
    return request<boolean>({
      url: chainAddressEnums[chainId].apiEndpoint + 'api/user/logOut',
      method: 'PUT',
      ...(options || {}),
    });
  }

  /** 设置链网络id PUT /api/user/setChainNetwork/${param0} */
  static async ApiUserSetChainNetworkById_PUT(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    chainId: number,
    params: Models.ApiUserSetChainNetworkByIdPUTParams,
    options?: { [key: string]: any },
  ) {
    const { id: param0, ...queryParams } = params;
    return request<boolean>({
      url: chainAddressEnums[chainId].apiEndpoint + 'api/user/setChainNetwork/${param0}',
      method: 'PUT',
      params: { ...queryParams },
      ...(options || {}),
    });
  }
}
