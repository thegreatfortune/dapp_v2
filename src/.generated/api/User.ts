// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';

export class UserService {
  /** uploadFile POST /api/user/upload */
  static async postUserUpload(body: {}, file?: File, options?: { [key: string]: any }) {
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
}
