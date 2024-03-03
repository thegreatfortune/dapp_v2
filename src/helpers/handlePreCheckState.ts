import { notification } from 'antd'
import { NotificationError } from '@/enums/error'

/* eslint-disable @typescript-eslint/indent */
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

export default handlePreCheckState
