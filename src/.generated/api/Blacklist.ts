// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class BlacklistService {
  /** 分页查询黑名单 GET /api/blacklist/pageInfo */
  static async ApiBlacklistPageInfo_GET(
    // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
    params: Models.ApiBlacklistPageInfoGETParams,
    options?: { [key: string]: any },
  ) {
    return request<{
      records?: { userAddress?: string; userPictureUrl?: string; userNickname?: string }[];
      total?: number;
      size?: number;
      current?: number;
    }>({
      url: '/api/blacklist/pageInfo',
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    });
  }
}
