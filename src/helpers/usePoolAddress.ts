import { useEffect, useState } from 'react'
import { message } from 'antd'
import { ZeroAddress } from 'ethers'
import { executeTask } from './helpers'
import { MessageError } from '@/enums/error'
import useCoreContract from '@/hooks/useCoreContract'

/* eslint-disable @typescript-eslint/indent */
const usePoolAddress = () => {
    const [capitalPoolAddress, setCapitalPoolAddress] = useState(ZeroAddress)
    const [refundPoolAddress, setRefundPoolAddress] = useState(ZeroAddress)
    const { coreContracts } = useCoreContract()
    const task = async () => {
        if (coreContracts) {
            const capitalPoolAddress = await coreContracts.processCenterContract._userToCatpitalPool(coreContracts.signer.address)
            setCapitalPoolAddress(capitalPoolAddress)
            if (capitalPoolAddress !== ZeroAddress) {
                const refundPoolAddress = await coreContracts.processCenterContract._getRefundPool(capitalPoolAddress)
                setRefundPoolAddress(refundPoolAddress)
            }
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
        capitalPoolAddress,
        refundPoolAddress,
    }
}

export default usePoolAddress
