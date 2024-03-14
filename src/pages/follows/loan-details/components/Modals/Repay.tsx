/* eslint-disable @typescript-eslint/indent */
import type { ModalProps } from 'antd'
import { Button, Modal } from 'antd'
import { MaxUint256, formatUnits } from 'ethers'
import { useEffect, useState } from 'react'
import { useChainId } from 'wagmi'
import useCoreContract from '@/hooks/useCoreContract'
import { executeTask, handleTransactionResponse } from '@/helpers/helpers'
import { NotificationInfo } from '@/enums/info'
import { MessageError } from '@/enums/error'
import { ChainAddressEnums, TokenEnums } from '@/enums/chain'
import useUserStore from '@/store/userStore'

interface IProps extends ModalProps {
    setOpen: (isOpen: boolean) => void
    tradeId: number
    // installments: number
}

const RepayModal: React.FC<IProps> = (props) => {
    const chainId = useChainId()
    const { coreContracts } = useCoreContract()
    const { currentUser } = useUserStore()

    const [repayAmount, setRepayAmount] = useState(BigInt(0))

    const [approving, setApproving] = useState(false)
    const [approveButtonText, setApproveButtonText] = useState('Approve')
    const [approveButtonDisabled, setApproveButtonDisabled] = useState(true)

    const [repaying, setRepaying] = useState(false)
    const [repayButtonText, setRepayButtonText] = useState('Repay')
    const [repayButtonDisabled, setRepayButtonDisabled] = useState(false)

    const [repaid, setRepaid] = useState(false)

    const resetModal = () => {
        setRepaying(false)
        setRepayButtonText('Repay')
        setRepayButtonDisabled(false)

        props.setOpen(false)
    }

    const checkAllowance = async (unitPrice?: bigint) => {
        if (coreContracts) {
            setApproving(true)
            setApproveButtonText('Checking...')
            setRepayButtonDisabled(true)

            const allowance = await coreContracts.usdcContract.allowance(currentUser.address, ChainAddressEnums[chainId].router)

            if (allowance < (unitPrice || repayAmount)) {
                setApproveButtonDisabled(false)
            }
            else {
                setApproveButtonDisabled(true)
                setRepayButtonDisabled(false)
            }

            setApproving(false)
            setApproveButtonText('Approve')
        }
    }

    const approve = async () => {
        const task = async () => {
            if (coreContracts) {
                setApproving(true)
                setApproveButtonDisabled(true)
                try {
                    const res = await coreContracts.usdcContract.approve(ChainAddressEnums[chainId].router, MaxUint256)
                    await handleTransactionResponse(res,
                        NotificationInfo.ApprovalSuccessfully,
                        NotificationInfo.ApprovalSuccessfullyDesc,
                    )
                }
                catch (error) {
                    setApproving(false)
                    setApproveButtonDisabled(false)
                    return
                }
                setApproving(false)
                setRepayButtonDisabled(false)
            }
            else {
                return Promise.reject(MessageError.ProviderOrSignerIsNotInitialized)
            }
        }
        executeTask(task)
    }

    const liquidate = async () => {
        const task = async () => {
            if (repayButtonText === 'Finish') {
                resetModal()
                return
            }
            if (coreContracts) {
                setRepaying(true)
                setRepayButtonDisabled(true)
                let res
                try {
                    res = await coreContracts.routerContract.doRepay(props.tradeId)

                    await handleTransactionResponse(res,
                        NotificationInfo.LiquidateSuccessfully,
                        NotificationInfo.LiquidateSuccessfullyDesc,
                    )
                }
                catch (error) {
                    setRepaying(false)
                    setRepayButtonDisabled(false)
                    return Promise.reject(error)
                }
                setRepaying(false)
                setRepayButtonDisabled(false)
                setRepayButtonText('Finish')

                setRepaid(true)
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
                const repayAmount = await coreContracts.processCenterContract.getOrderReapyMoney(props.tradeId)
                if (repayAmount === BigInt(0))
                    setRepayButtonDisabled(true)
                setRepayAmount(repayAmount)
                checkAllowance()
            }
        }
        executeTask(task)
    }, [coreContracts, props.open])

    return <Modal open={props.open}
        onCancel={() => resetModal()}
        title={'Repay'}
        centered={true}
        footer={
            <div className='grid grid-cols-2 gap-16'>
                <Button className={`h-40 text-16 ${!approveButtonDisabled ? 'primary-btn' : ''}`} type='primary'
                    loading={approving}
                    disabled={approveButtonDisabled}
                    onClick={approve}
                >{approveButtonText}</Button>
                <Button className={`h-40 text-16 ${!repayButtonDisabled ? 'primary-btn' : ''}`} type='primary'
                    loading={repaying}
                    disabled={repayButtonDisabled}
                    onClick={liquidate}
                >{repayButtonText}</Button>
            </div >
        }
    >
        <div className='mt-30 h-60 text-16'>
            {
                repaid
                    ? (<div>
                        This loan has been repaid successfully!
                    </div>)
                    : repayAmount === BigInt(0)
                        ? (<div>
                            This loan do not need to be repaid.
                        </div>)
                        : (<div>
                            The repay amount of this loan is
                            <span className='text-18'> {formatUnits(repayAmount, TokenEnums[chainId].USDC.decimals)} </span>
                            USDC
                        </div>
                        )
            }
        </div>
    </Modal >
}

export default RepayModal
