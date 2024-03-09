/* eslint-disable @typescript-eslint/indent */
import type { ModalProps } from 'antd'
import { Button, Modal } from 'antd'
import { parseUnits } from 'ethers'
import { useState } from 'react'
import CurrencyInput from 'react-currency-input-field'
import { useChainId } from 'wagmi'
import { ChainAddressEnums, TokenEnums } from '@/enums/chain'
import useCoreContract from '@/hooks/useCoreContract'
import useUserStore from '@/store/userStore'
import { executeTask, handleTransactionResponse } from '@/helpers/helpers'
import { NotificationInfo } from '@/enums/info'

interface IProps extends ModalProps {
    setOpen: (isOpen: boolean) => void
    capitalPoolAddress?: string
    tradeId: bigint
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

            console.log(allowance, parseUnits(amount, TokenEnums[chainId].USDC.decimals))

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
                const res = await coreContracts.usdcContract.approve(ChainAddressEnums[chainId].processCenter, depositAmount)
                await handleTransactionResponse(res,
                    NotificationInfo.ApprovalSuccessfully,
                    NotificationInfo.ApprovalSuccessfullyDesc,
                )
                setApproving(false)
                setDepositButtonDisabled(false)
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
                const res = await coreContracts.processCenterContract.supply(TokenEnums[chainId].USDC.address, depositAmount, props.tradeId)
                await handleTransactionResponse(res,
                    NotificationInfo.ApprovalSuccessfully,
                    NotificationInfo.ApprovalSuccessfullyDesc,
                )
                setDepositing(false)
                setDepositButtonDisabled(false)
                setDepositButtonText('Finish')
            }
        }
        executeTask(task)
    }

    return <Modal open={props.open}
        onCancel={() => props.setOpen(false)}
        okText={props.okText}
        title={'Deposit USDC to capital pool'}
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
        <div className='h-130 py-20'>
            <div className='md:flex md:justify-between'>
                <div className='flex items-center text-16'>Capital Pool:</div>
                <div className='flex items-center text-16 max-md:mt-5'>{props.capitalPoolAddress}</div>
            </div>
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
    </Modal >
}

export default DepositModal
