import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { message, notification } from 'antd'
import useUserStore from '../store/userStore'

enum HttpCode {
  RETRY = 100404,
  RESET_CONTENT = 100205,
  RE_LOGIN = 120401,
}

interface IResponse<T> {
  code: number
  message: string
  data?: T
}

function handleResponse(response: AxiosResponse): AxiosResponse {
  const responseData: IResponse<any> = response.data

  if (response.status !== 200) {
    message.error(`${response.status}: ${response.statusText}` || 'The request failed. Please try again')
    throw responseData.data
  }

  if (responseData.code !== 200 && responseData.code !== HttpCode.RESET_CONTENT) {
    if (responseData.code === HttpCode.RETRY)
      return response

    if (responseData.code === HttpCode.RE_LOGIN)
      useUserStore.getState().clear()
      // localStorage.removeItem('persist:userStore')

    // localStorage.removeItem('userStore')
    // localStorage.clear()

    message.error(`${responseData.code}: ${responseData.message}` || 'The request failed. Please try again')
    throw new Error(`${responseData.code}: ${responseData.message}`)
  }

  return response
}

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const result = await axios.request<T>({ headers: { 'Content-Type': 'application/json', ...config.headers }, ...config })

    const responseData = handleResponse(result).data as IResponse<T>

    // const responseData = result.data as IResponse<T>

    if (responseData.code === HttpCode.RETRY) {
      await handleRetry(config)
      throw new Error(`${responseData.code}: ${responseData.message}`)
    }

    return responseData.data as T
  }
  catch (error) {
    console.log('%c [ error ]-47', 'font-size:13px; background:#ef2b7a; color:#ff6fbe;', error)
    throw error
  }
}

async function handleRetry<T>(config: AxiosRequestConfig): Promise<T> {
  return new Promise((resolve, reject) => {
    notification.error({
      message: 'Please try again',
      description: 'Request error, please try again',
      onClick: async () => {
        try {
          const retryResult = await axios.request<T>({ headers: { 'Content-Type': 'application/json', ...config.headers }, ...config })
          const retryResponseData = retryResult.data as IResponse<T>

          if (retryResponseData.code === HttpCode.RETRY)
            reject(new Error(`${retryResponseData.code}: ${retryResponseData.message}`))

          resolve(retryResponseData.data as T)
        }
        catch (retryError) {
          console.log('Retry error:', retryError)
          reject(retryError)
        }
      },
    })
  })
}

// Interceptors

axios.interceptors.request.use((config) => {
  const headers = config.headers || {}
  headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  headers['Chain-Id'] = useUserStore.getState().activeUser.chainId
  headers.Authorization = headers.Authorization || useUserStore.getState().activeUser.accessToken
  config.headers = headers
  return config
})

// axios.interceptors.response.use(
//   response => handleResponse(response),
//   error => handleError(error),
// )

// function handleError(error: any): Promise<never> {
//   message.error('请求失败，请重试')
//   return Promise.reject(error.response)
// }

export default request
