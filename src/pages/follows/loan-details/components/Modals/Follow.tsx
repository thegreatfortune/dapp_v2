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

const FollowModal: React.FC<IProps> = (props) => {
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

    return <Modal open={followModalOpen}
        className='h238 w464 b-rd-8'
        okText={followModalBtnText}
        onOk={() => handleFollow()}
        onCancel={() => {
            setCopies(1)
            setUsdcApproved(0)
            setFollowed(0)
            setExecuting(false)
            setFollowModalOpen(false)
        }}
        okButtonProps={{ type: 'primary', className: 'primary-btn', disabled: executing }}
    >
        <div>
            <h2 className='font-b m-10 w40 flex items-center text-20 c-#fff lh-21'>
                {lendingState ? 'Processing' : 'Share'}
            </h2>
            <div className='w-full flex content-center items-center justify-end'>
                <InputNumber
                    size='large'
                    value={copies}
                    className='m-10 w-full w150 b-#808080 text-center'
                    min={1}
                    onChange={async (v) => {
                        if (!browserContractService?.getSigner.address)
                            return
                        if (v) {
                            if (v > maxCopies) {
                                message.error('You can not follow over max shares!')
                                v = maxCopies
                            }
                            else {
                                const amount = await browserContractService.calculateFollowAmountFromCopies(BigInt(tradeId!), BigInt(v))
                                setFollowUSDCAmount(amount)
                            }
                        }
                        setCopies(v)
                    }}
                    disabled={executing}
                />
                <Button type='primary' loading={checkMaxLoading} onClick={onSetMax} disabled={executing}>
                    Max
                </Button>
            </div>
            <div className='flex justify-end'>
                {copies} Share = {copies === 1 ? formatUnits(unitPrice, 18) : formatUnits(followUSDCAmount, 18)} USDC
            </div>
            <div className='mt-30'>
                {
                    usdcApproved === 0
                        ? <div className='flex items-center justify-between'>
                            <div className='flex'>
                                <div className='mr-8'>1.</div>Approve your USDC for Follow Finance Protocol</div>
                            <div className='m-8'><BorderOutlined /></div>
                        </div>
                        : usdcApproved === 1
                            ? <div className='flex items-center justify-between'>
                                <div className='flex'>
                                    <div className='mr-8'>1.</div>Approve...</div>
                                <div className='m-8'><LoadingOutlined /></div>
                            </div>
                            : usdcApproved === 2
                                ? <div className='flex items-center justify-between'>
                                    <div className='flex'>
                                        <div className='mr-8'>1.</div>Approved successfully!</div>
                                    <div className='m-8'><CheckOutlined className='text-green-500' /></div>
                                </div>
                                : <div className='flex items-center justify-between'>
                                    <div className='flex'>
                                        <div className='mr-8'>1.</div>Approval failed!</div>
                                    <div className='m-8'><CloseSquareOutlined className='text-red-500' /></div>
                                </div>
                }
                {
                    followed === 0
                        ? <div className='flex items-center justify-between'>
                            <div className='flex'>
                                <div className='mr-8'>2.</div>Follow this loan</div>
                            <div className='m-8'><BorderOutlined /></div>
                        </div>
                        : followed === 1
                            ? <div className='flex items-center justify-between'>
                                <div className='flex'>
                                    <div className='mr-8'>2.</div>Following...</div>
                                <div className='m-8'><LoadingOutlined /></div>
                            </div>
                            : followed === 2
                                ? <div className='flex items-center justify-between'>
                                    <div className='flex'>
                                        <div className='mr-8'>2.</div>Followed successfully!</div>
                                    <div className='m-8'><CheckOutlined className='text-green-500' /></div>
                                </div>
                                : <div className='flex items-center justify-between'>
                                    <div className='flex'>
                                        <div className='mr-8'>2.</div>Follow failed!</div>
                                    <div className='m-8'><CloseSquareOutlined className='text-red-500' /></div>
                                </div>
                }
            </div>
        </div>
    </Modal >

}

export default FollowModal
