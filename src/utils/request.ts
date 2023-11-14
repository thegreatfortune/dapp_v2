import message from 'antd/es/message'
import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

interface IResponse<T> {
  code: number
  message: string
  data?: T
}

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const result = await axios.request<T>({
      headers: {
        'Content-Type': 'application/json',
        ...config.headers ?? {},
      },
      ...config,
    })

    return (result.data as IResponse<T>).data as T
  }
  catch (error) {
    // 显示错误通知
    message.error('请求失败，请重试')

    return Promise.reject(error)
  }
}

axios.interceptors.request.use((config) => {
  return config
})

axios.interceptors.response.use(
  (response) => {
    const responseData: IResponse<any> = response.data
    if (response.status !== 200) {
      message.error(`${response.status}: ${response.statusText}` || '请求失败，请重试')

      return Promise.reject(responseData.data)
    }

    if (responseData.code !== 200) {
      message.error(`${responseData.code}: ${responseData.message}` || '请求失败，请重试')

      return Promise.reject(responseData.data)
    }

    return response
  },
  (err) => {
    message.error('请求失败，请重试')

    return Promise.reject(err.response)
  },
)

export default request
