/* eslint-disable @typescript-eslint/indent */
import { useEffect, useState } from 'react'
import { message } from 'antd'
import useCoreContract from './useCoreContract'
import { executeTask } from '@/helpers/helpers'
import { MessageError } from '@/enums/error'

const useNftWhitelist = () => {
    const { coreContracts } = useCoreContract()
    const [inWhitelist, setInWhitelist] = useState<boolean[]>([false, false, false, false])
    const [isFinished, setIsFinished] = useState(false)
    const task = async () => {
        if (coreContracts) {
            const octopus = await coreContracts.nftContract.getIfWhitelist(coreContracts.signer.address, 0)
            const dolphin = await coreContracts.nftContract.getIfWhitelist(coreContracts.signer.address, 1)
            const shark = await coreContracts.nftContract.getIfWhitelist(coreContracts.signer.address, 3)
            const whale = await coreContracts.nftContract.getIfWhitelist(coreContracts.signer.address, 3)
            setInWhitelist([octopus, dolphin, shark, whale])

            setIsFinished(true)
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
        inWhitelist,
        isFinished,
    }
}
export default useNftWhitelist
