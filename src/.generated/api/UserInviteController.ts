// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class UserInviteControllerService {
  /** 查询是否被邀请过 GET /api/user/invite/invitedOrNot */
  static async ApiUserInviteInvitedOrNot_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiUserInviteInvitedOrNotGETParams,
    options?: { [key: string]: any },
  ) {
    return request<boolean>({
      url: '/api/user/invite/invitedOrNot',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
