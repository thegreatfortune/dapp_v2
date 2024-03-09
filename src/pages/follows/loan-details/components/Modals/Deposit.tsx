/* eslint-disable @typescript-eslint/indent */
import type { ModalProps } from 'antd'
import { Button, Modal, message } from 'antd'
import { parseUnits } from 'ethers'
import { useState } from 'react'
import CurrencyInput from 'react-currency-input-field'
import { useChainId } from 'wagmi'
import { ChainAddressEnums, TokenEnums } from '@/enums/chain'
import useCoreContract from '@/hooks/useCoreContract'
import useUserStore from '@/store/userStore'
import { executeTask, handleTransactionResponse } from '@/helpers/helpers'
import { NotificationInfo } from '@/enums/info'
import { MessageError } from '@/enums/error'

interface IProps extends ModalProps {
    setOpen: (isOpen: boolean) => void
    tradeId: bigint
    capitalPoolAddress: string
}

const DepositModal: React.FC<IProps> = (props) => {
    const chainId = useChainId()
    const { currentUser } = useUserStore()
    const { coreContracts } = useCoreContract()

    const [approving, setApproving] = useState(false)
    const [approveButtonText, setApproveButtonText] = useState('Approve')
    const [approveButtonDisabled, setApproveButtonDisabled] = useState(true)

    const [depositing, setDepositing] = useState(false)
    const [depositButtonText, setDepositButtonText] = useState('Deposit')
    const [depositButtonDisabled, setDepositButtonDisabled] = useState(true)

    const [depositAmount, setDepositAmount] = useState(BigInt(0))

    const resetModal = () => {
        setApproving(false)
        setApproveButtonText('Approve')
        setApproveButtonDisabled(true)
        setDepositing(false)
        setDepositButtonText('Deposit')
        setDepositButtonDisabled(true)
        setDepositAmount(BigInt(0))
        props.setOpen(false)
    }

    const checkAllowance = async (amount: string) => {
        if (coreContracts) {
            setApproving(true)
            setApproveButtonText('Checking...')
            setDepositButtonDisabled(true)

            const allowance = await coreContracts.usdcContract.allowance(currentUser.address, ChainAddressEnums[chainId].processCenter)

            if (allowance < parseUnits(amount, TokenEnums[chainId].USDC.decimals)) {
                setDepositAmount(parseUnits(amount, TokenEnums[chainId].USDC.decimals))
                setApproveButtonDisabled(false)
            }
            else {
                setApproveButtonDisabled(true)
                setDepositButtonDisabled(false)
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
                    const res = await coreContracts.usdcContract.approve(ChainAddressEnums[chainId].processCenter, depositAmount)
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
                setDepositButtonDisabled(false)
            }
            else {
                message.error(MessageError.ProviderOrSignerIsNotInitialized)
                return Promise.reject(MessageError.ProviderOrSignerIsNotInitialized)
            }
        }
        executeTask(task)
    }

    const deposit = async () => {
        const task = async () => {
            if (depositButtonText === 'Finish')
                resetModal()

            if (coreContracts) {
                setDepositing(true)
                setDepositButtonDisabled(true)
                try {
                    const res = await coreContracts.processCenterContract.supply(TokenEnums[chainId].USDC.address, depositAmount, props.tradeId)
                    await handleTransactionResponse(res,
                        NotificationInfo.ApprovalSuccessfully,
                        NotificationInfo.ApprovalSuccessfullyDesc,
                    )
                }
                catch (error) {
                    setDepositing(false)
                    setDepositButtonDisabled(false)
                    return
                }
                setDepositing(false)
                setDepositButtonDisabled(false)
                setDepositButtonText('Finish')
            }
            else {
                message.error(MessageError.ProviderOrSignerIsNotInitialized)
                return Promise.reject(MessageError.ProviderOrSignerIsNotInitialized)
            }
        }
        executeTask(task)
    }

    return <Modal open={props.open}
        onCancel={() => resetModal()}
        okText={props.okText}
        title={'Deposit USDC to capital pool'}
        centered={true}
        footer={
            <div className='grid grid-cols-2 gap-16'>
                <Button className={`h-40 text-16 ${!approveButtonDisabled ? 'primary-btn' : ''}`} type='primary'
                    loading={approving}
                    disabled={approveButtonDisabled}
                    onClick={approve}
                >{approveButtonText}</Button>
                <Button className={`h-40 text-16 ${!depositButtonDisabled ? 'primary-btn' : ''}`} type='primary'
                    loading={depositing}
                    disabled={depositButtonDisabled}
                    onClick={deposit}
                >{depositButtonText}</Button>
            </div>
        }
    >
        <div className='h-300 py-10'>
            <div className='grid grid-rows-2 my-30 gap-4'>
                <div className='text-16'>Capital Pool of this loan:</div>
                <div className='text-14 max-md:mt-5'>{props.capitalPoolAddress}</div>
            </div>
            <div className='grid grid-rows-2 my-30 gap-4'>
                <div className='text-16'>Approve to Follow Process Center:</div>
                <div className='text-14 max-md:mt-5'>{ChainAddressEnums[chainId].processCenter}</div>
            </div>
            <div className='my-30'>
                <div className='mt-15 text-16'>USDC Amount:</div>
                <div className='mt-5 w-full flex'>
                    <CurrencyInput
                        className='font-semiBold h-40 w-full border-0 rounded-5 bg-black text-20 text-white outline-1 outline'
                        style={{ outlineColor: '#424242' }}
                        name="depositAmount"
                        placeholder="0"
                        decimalsLimit={6}
                        allowNegativeValue={false}
                        onValueChange={(_value, _name, values) => {
                            if (values && values.value !== '0')
                                checkAllowance(values?.value)
                        }}
                    />
                </div>
            </div>
        </div>
    </Modal >
}

export default DepositModal
