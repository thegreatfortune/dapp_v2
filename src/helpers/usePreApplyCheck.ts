/* eslint-disable @typescript-eslint/indent */

import { message } from 'antd'
import { useEffect, useState } from 'react'
import { executeTask } from './helpers'
import { MessageError } from '@/enums/error'
import useCoreContract from '@/hooks/useCoreContract'

const usePreApplyCheck = () => {
    const [inBlacklist, setInBlacklist] = useState(true)
    const [poolIsCreated, setPoolIsCreated] = useState(false)
    const [canCreateLoan, setCanCreateLoan] = useState(false)
    const [checked, setChecked] = useState(false)

    const { coreContracts } = useCoreContract()

    const task = async () => {
        if (coreContracts) {
            const rInBL = await coreContracts.processCenterContract._getIfBlackList(coreContracts.signer.address)
            setInBlacklist(rInBL)

            const capitalFactoryContract = coreContracts.capitalFactoryContract
            const state = await capitalFactoryContract.getIfCreate(coreContracts.signer.address)
            // if state === 1 , the capital pool is created, if state!==1 the captial pool is not created yet, the user can create it
            if (state === BigInt(1)) {
                setPoolIsCreated(true)
                const processCenterContract = coreContracts.processCenterContract
                const canCreate = await processCenterContract.getIfAgainCreateOrder(coreContracts.signer.address)
                setCanCreateLoan(canCreate)
            }
            else {
                // pool is not created, so user can create pool and then can create new loan
                setCanCreateLoan(true)
            }
            setChecked(true)
            return Promise.resolve(true)
        }
        else {
            message.error(MessageError.ProviderOrSignerIsNotInitialized)
            return Promise.reject(new Error(MessageError.ProviderOrSignerIsNotInitialized))
        }
    }

    useEffect(() => {
        if (coreContracts)
            executeTask(task)
    }, [coreContracts])

    return {
        inBlacklist,
        poolIsCreated,
        canCreateLoan,
        checked,
    }
}
export default usePreApplyCheck
