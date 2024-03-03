import { useEffect, useState } from 'react'
import { message } from 'antd'
import { executeTask } from './helpers'
import { MessageError } from '@/enums/error'
import useCoreContract from '@/hooks/useCoreContract'

/* eslint-disable @typescript-eslint/indent */
const usePoolCreationState = () => {
    const [captialPoolCreationState, setCapitalPoolCreationState] = useState(false)
    const [refundPoolCreationState, setRefundPoolCreationState] = useState(false)
    const { coreContracts } = useCoreContract()
    const task = async () => {
        if (coreContracts) {
            const capitalPoolState = await coreContracts.routerContract.getCreateCapitalState(coreContracts.signer.address)
            const refundPoolState = await coreContracts.routerContract.getCreateRefundState(coreContracts.signer.address)
            setCapitalPoolCreationState(capitalPoolState)
            setRefundPoolCreationState(refundPoolState)
        }
        else {
            message.error(MessageError.ProviderOrSignerIsNotInitialized)
            return Promise.reject(MessageError.ProviderOrSignerIsNotInitialized)
        }
    }
    useEffect(() => {
        if (coreContracts)
            executeTask(task)
    }, [coreContracts])

    return {
        captialPoolCreationState,
        refundPoolCreationState,
    }
}

export default usePoolCreationState
