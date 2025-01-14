// @ts-ignore
/* eslint-disable */
import request from '../../utils/request';
import { Models } from './models';
import { ChainAddressEnums } from '@/enums/chain';

export class FileService {
  /** uploadFile POST /api/file/upload */
  static async ApiFileUpload_POST(chainId: number, body: {}, file?: File, options?: { [key: string]: any }) {
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
      url: ChainAddressEnums[chainId].apiEndpoint + 'api/file/upload',
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      ...(options || {}),
    });
  }
}
