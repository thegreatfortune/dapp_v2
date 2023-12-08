// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class UserService {
  /** login POST /api/user/login */
  static async ApiUserLogin_POST(body: Models.LoginDto, options?: { [key: string]: any }) {
    return request<Models.AuthResult>({
      url: '/api/user/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }

  /** uploadFile POST /api/user/upload */
  static async ApiUserUpload_POST(body: {}, file?: File, options?: { [key: string]: any }) {
    const formData = new FormData();

    if (file) {
      formData.append('file', file);
    }

    Object.keys(body).forEach((ele) => {
      const item = (body as any)[ele];

      if (item !== undefined && item !== null) {
        if (typeof item === 'object' && !(item instanceof File)) {
          if (item instanceof Array) {
            item.forEach((f) => formData.append(ele, f || ''));
          } else {
            formData.append(ele, JSON.stringify(item));
          }
        } else {
          formData.append(ele, item);
        }
      }
    });

    return request<string>({
      url: '/api/user/upload',
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      ...(options || {}),
    });
  }

  /** 获取当期登录用户的信息 GET /api/user/userInfo */
  static async ApiUserUserInfo_GET(options?: { [key: string]: any }) {
    return request<Models.UserInfoVo>({
      url: '/api/user/userInfo',
      method: 'GET',
      ...(options || {}),
    });
  }
}
