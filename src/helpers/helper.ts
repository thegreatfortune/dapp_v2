import { message } from 'antd'
import { MessageError } from '@/enums/error'

/* eslint-disable @typescript-eslint/indent */
type Task<T> = () => Promise<T>
export const executeTask = async<T>(task: Task<T>) => {
    try {
        return task()
    }
    catch (error) {
        if (error instanceof Error) {
            for (const value in Object.values(MessageError)) {
                if (error.toString() === value) {
                    message.error(value)
                    return Promise.reject(value)
                }
            }
            // if (error.toString() === MessageError.ProviderOrSignerIsNotInitialized) {
            //     message.error(MessageError.ProviderOrSignerIsNotInitialized)
            //     return Promise.reject(MessageError.ProviderOrSignerIsNotInitialized)
            // }
            // if (error.toString() !== MessageError.GenenalError) {
            //     message.error(error.toString())
            //     return Promise.reject(error.toString())
            // }
            // else {
            message.error(MessageError.GenenalError)
            return Promise.reject(MessageError.GenenalError)
            // }
        }
        else {
            message.error(MessageError.GenenalError)
            return Promise.reject(MessageError.GenenalError)
        }
    }
}
