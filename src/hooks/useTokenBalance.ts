/* eslint-disable @typescript-eslint/indent */
import { useEffect, useState } from 'react'
import { message } from 'antd'
import useCoreContract from './useCoreContract'
import { executeTask } from '@/helpers/helper'
import { MessageError } from '@/enums/error'

const useTokenBalance = () => {
    const { coreContracts } = useCoreContract()
    const [fofBalance, setFofBalance] = useState(BigInt(0))
    const [nftBalance, setNftBalance] = useState([BigInt(0), BigInt(0), BigInt(0), BigInt(0)])
    const [isFinished, setIsFinished] = useState(false)
    const task = async () => {
        if (coreContracts) {
            const fofBalance = await coreContracts.fofContract.balanceOf(coreContracts.signer.address)
            setFofBalance(fofBalance)

            const octopus = await coreContracts.nftContract.balanceOf(coreContracts.signer.address, 0)
            const dolphin = await coreContracts.nftContract.balanceOf(coreContracts.signer.address, 1)
            const shark = await coreContracts.nftContract.balanceOf(coreContracts.signer.address, 2)
            const whale = await coreContracts.nftContract.balanceOf(coreContracts.signer.address, 3)

            setNftBalance([octopus, dolphin, shark, whale])

            setIsFinished(true)
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
        fofBalance,
        nftBalance,
        isFinished,
    }
}
export default useTokenBalance
