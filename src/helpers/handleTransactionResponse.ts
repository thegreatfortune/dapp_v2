/* eslint-disable @typescript-eslint/indent */
import type { ethers } from 'ethers'
import { notification } from 'antd'
import { MessageError, NotificationError } from '@/enums/error'
import { NotificationInfo } from '@/enums/info'

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
export default handleTransactionResponse
