// @ts-ignore
/* eslint-disable */
import { ChainAddressEnums } from '@/enums/chain';
import request from '../../utils/request';
import { Models } from './models';

export class UserInviteRedirectService {
  /** 用户邀请重定向到注册页面 GET /invite/${param0} */
  static async InviteByInviteCode_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    chainId: number,
    params: Models.InviteByInviteCodeGETParams,
    options?: { [key: string]: any },
  ) {
    const { inviteCode: param0, ...queryParams } = params;
    return request<Models.RedirectView>({
      url: ChainAddressEnums[chainId].apiEndpoint + 'invite/${param0}',
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    });
  }
}
