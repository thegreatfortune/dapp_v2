/* eslint-disable @typescript-eslint/indent */
import { useEffect, useState } from 'react'
import { message } from 'antd'
import { ZeroAddress } from 'ethers'
import { executeTask } from './helpers'
import { MessageError } from '@/enums/error'
import useCoreContract from '@/hooks/useCoreContract'
import { createContract } from '@/contract/coreContracts'
import type {
    FollowCapitalPool as capitalPool,
    FollowRefundPool as refundPool,
} from '@/abis/types'
import capitalPoolABI from '@/abis/FollowCapitalPool.json'
import refundPoolABI from '@/abis/FollowRefundPool.json'

const usePoolAddress = () => {
    const [capitalPoolAddress, setCapitalPoolAddress] = useState(ZeroAddress)
    const [refundPoolAddress, setRefundPoolAddress] = useState(ZeroAddress)
    const [capitalPool, setCapitalPool] = useState<capitalPool>()
    const [refundPool, setRefunPool] = useState<refundPool>()
    const { coreContracts } = useCoreContract()
    const task = async () => {
        if (coreContracts) {
            const capitalPoolAddress = await coreContracts.processCenterContract._userToCatpitalPool(coreContracts.signer.address)
            setCapitalPoolAddress(capitalPoolAddress)
            if (capitalPoolAddress !== ZeroAddress) {
                const capitalPoolContract = createContract<capitalPool>(capitalPoolAddress, capitalPoolABI, coreContracts.signer)
                coreContracts.capitalPoolContract = capitalPoolContract
                setCapitalPool(capitalPoolContract)

                const refundPoolAddress = await coreContracts.processCenterContract._getRefundPool(capitalPoolAddress)
                setRefundPoolAddress(refundPoolAddress)
                if (refundPoolAddress !== ZeroAddress) {
                    const refundPoolContract = createContract<refundPool>(refundPoolAddress, refundPoolABI, coreContracts.signer)
                    coreContracts.refundPoolContract = refundPoolContract
                    setRefunPool(refundPoolContract)
                }
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
        capitalPool,
        capitalPoolAddress,
        refundPool,
        refundPoolAddress,
    }
}

export default usePoolAddress
