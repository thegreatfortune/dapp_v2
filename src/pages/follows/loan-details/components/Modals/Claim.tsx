/* eslint-disable @typescript-eslint/indent */
import type { ModalProps } from 'antd'
import { Button, Modal } from 'antd'
import { formatUnits } from 'ethers'
import { useEffect, useState } from 'react'
import useCoreContract from '@/hooks/useCoreContract'
import { executeTask, handleTransactionResponse } from '@/helpers/helpers'
import { NotificationInfo } from '@/enums/info'
import { MessageError } from '@/enums/error'
import type { Models } from '@/.generated/api/models'

interface IProps extends ModalProps {
    setOpen: (isOpen: boolean) => void
    tradeId: number
    loanState: Models.LoanState
}

const ClaimModal: React.FC<IProps> = (props) => {
    const { coreContracts } = useCoreContract()

    const [claimed, setClaimed] = useState(false)
    const [claimAmount, setClaimAmount] = useState(BigInt(0))

    const [claiming, setClaiming] = useState(false)
    const [claimButtonText, setClaimButtonText] = useState('Claim')
    const [claimButtonDisabled, setClaimButtonDisabled] = useState(true)

    const resetModal = () => {
        setClaiming(false)
        setClaimButtonText('Claim')
        setClaimButtonDisabled(true)

        props.setOpen(false)
    }
    const claim = async () => {
        const task = async () => {
            if (claimButtonText === 'Finish') {
                resetModal()
                return
            }
            if (coreContracts) {
                setClaiming(true)
                setClaimButtonDisabled(true)
                try {
                    const res = await coreContracts.routerContract.claimToken(props.tradeId)
                    await handleTransactionResponse(res,
                        NotificationInfo.ClaimSuccessfully,
                        NotificationInfo.ClaimSuccessfullyFOFDesc,
                    )
                }
                catch (error) {
                    setClaiming(false)
                    setClaimButtonDisabled(false)
                    return Promise.reject(error)
                }
                setClaiming(false)
                setClaimButtonDisabled(false)
                setClaimButtonText('Finish')

                setClaimed(true)
                setClaimAmount(BigInt(0))
            }
            else {
                return Promise.reject(MessageError.ProviderOrSignerIsNotInitialized)
            }
        }
        executeTask(task)
    }

    useEffect(() => {
        const task = async () => {
            if (coreContracts) {
                if (!claimed) {
                    const claimed = await coreContracts.routerContract.getUserIfWithdraw(props.tradeId)
                    setClaimed(claimed)
                    if (!claimed) {
                        if (props.loanState === 'PaidOff' && claimAmount === BigInt(0)) {
                            const balance = await coreContracts.routerContract.getUserEarnTokenAmount(props.tradeId)
                            // console.log(balance)
                            if (balance > BigInt(0)) {
                                setClaimButtonDisabled(false)
                                setClaimAmount(balance)
                            }
                        }
                        else {
                            setClaimButtonDisabled(false)
                        }
                    }
                }
            }
        }
        executeTask(task)
    }, [coreContracts, props.open])

    return <Modal open={props.open}
        onCancel={() => resetModal()}
        title={'Claim'}
        centered={true}
        footer={
            <div className='flex justify-end' >
                <Button className={`h-40 text-16 w-1/2 ${!claimButtonDisabled ? 'primary-btn' : ''}`} type='primary'
                    loading={claiming}
                    disabled={claimButtonDisabled}
                    onClick={claim}
                >{claimButtonText}</Button>
            </div >
        }
    >
        <div className='mt-30 h-60 text-16'>
            {
                claimed
                    ? 'You have claimed $FOF successfully.'
                    : `You will receive ${formatUnits(claimAmount, 18)} $FOF`
            }
        </div>
    </Modal >
}

export default ClaimModal
