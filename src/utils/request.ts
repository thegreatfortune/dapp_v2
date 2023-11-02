import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

interface IResponse<T> {
  code: number
  message: string
  data?: T
}

async function request<T>(config: AxiosRequestConfig): Promise <IResponse<T>> {
  try {
    const result = await axios.request<T>(
      {
        headers: {
          'Content-Type': 'application/json',
          ...config.headers ?? {},
        },
        ...config,
      },
    )

    return result.data as IResponse<T>
  }
  catch (error) {
    return Promise.reject(error)
  }
}

axios.interceptors.request.use((config) => {
  return config
})

axios.interceptors.response.use(
  (response) => {
    if (response.status !== 200)
      return Promise.reject(response.data)

    return response
  },
  (err) => {
    Promise.reject(err.response)
  },
)

export default request
