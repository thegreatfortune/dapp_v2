import message from 'antd/es/message'
import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import useUserStore from '../store/userStore'

enum HttpCode {
  /**
   *重试
   */
  RETRY = 100404,
}

// TODO 重试

interface IResponse<T> {
  code: number
  message: string
  data?: T
}

async function request<T>(config: AxiosRequestConfig): Promise<T | undefined> {
  const RETRIES = 3 // 重试次数

  const newConfig: AxiosRequestConfig = { ...config }

  // while (RETRIES > 0) {
  try {
    const result = await axios.request<T>({
      headers: {
        'Content-Type': 'application/json',
        ...newConfig.headers ?? {},
      },
      ...newConfig, // 使用新的副本，以免影响原来的配置
    })

    const responseData = result.data as IResponse<T>

    return responseData.data

    // if (responseData.code === HttpCode.RETRY && RETRIES > 0) {
    //   message.error(`${responseData.message}`)

    //   RETRIES--

    //   // if(RETRIES === - 1) {
    //   // Promise.reject((responseData.data as IResponse<T>).data as T)

    //   // }
    // }
    // else {
    //   RETRIES = -1

    //   return (responseData.data as IResponse<T>).data as T
    // }
  }
  catch (error) {
    console.log('%c [ error ]-47', 'font-size:13px; background:#ef2b7a; color:#ff6fbe;', error)
    // message.error('请求失败，请重试')

    // // 如果没有重试次数，则抛出错误
    // if (RETRIES === 0)
    //   throw error
  }
  // }
}

axios.interceptors.request.use((config) => {
  const headers = config.headers || {}
  if (!headers['Content-Type'])
    headers['Content-Type'] = 'application/json'

  if (!headers.Authorization)
    headers.Authorization = useUserStore.getState().activeUser.accessToken

  config.headers = headers

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
      if (responseData.code === HttpCode.RETRY)
        return response

      message.error(`${responseData.code}: ${responseData.message}` || '请求失败，请重试')

      console.log('%c [ responseData.data ]-49', 'font-size:13px; background:#26cf71; color:#6affb5;', responseData.data)
      return Promise.reject(new Error(`${responseData.code}: ${responseData.message}`))
    }

    return response
  },
  (err) => {
    message.error('请求失败，请重试')

    return Promise.reject(err.response)
  },
)

export default request
