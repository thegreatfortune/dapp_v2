import { message, notification } from 'antd'
import type { ethers } from 'ethers'
import { MessageError, NotificationError } from '@/enums/error'
import { NotificationInfo } from '@/enums/info'

/* eslint-disable @typescript-eslint/indent */
type Task<T> = () => Promise<T>
const executeTask = async<T>(task: Task<T>) => {
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

const handlePreCheckState = (inBlacklist: boolean, canCreateLoan: boolean) => {
    if (inBlacklist) {
        notification.error({
            message: NotificationError.CannotApplyLoan,
            description: NotificationError.CannotApplyLoanDesc,
            placement: 'bottomRight',
        })
    }
    else {
        if (canCreateLoan) {
            return true
        }
        else {
            notification.error({
                message: NotificationError.CannotApplyLoan,
                description: NotificationError.CannotApplyLoanDesc,
                placement: 'bottomRight',
            })
        }
    }
    return false
}

const handleTransactionResponse = async (
    transactionResponse: ethers.ContractTransactionResponse,
    successNotification: NotificationInfo = NotificationInfo.TransactionSuccessful,
    successNotificationDesc: NotificationInfo = NotificationInfo.TransactionSuccessfulDesc,
    failureNotification: NotificationError = NotificationError.TransactionFailed,
    failureNotificationDesc: NotificationError = NotificationError.TransactionFailedDesc,
) => {
    const receipt = await transactionResponse.wait()
    if (!receipt) {
        notification.error({
            message: NotificationError.TransactionError,
        })
        throw new Error(MessageError.NullReceipt)
    }

    if (receipt.status === 1) {
        // Transaction successful
        notification.success({
            message: successNotification,
            description: successNotificationDesc,
            placement: 'bottomRight',
        })
    }
    else {
        // Transaction failed
        notification.error({
            message: failureNotification,
            description: failureNotificationDesc,
            placement: 'bottomRight',
        })
        throw new Error(MessageError.TransactionFailed)
    }
    return Promise.resolve(receipt)
}

export {
    executeTask,
    handlePreCheckState,
    handleTransactionResponse,
}
