/* eslint-disable @typescript-eslint/indent */
import type { ModalProps } from 'antd'
import { Button, Modal } from 'antd'
import { ZeroAddress, formatUnits } from 'ethers'
import { useEffect, useState } from 'react'
import useCoreContract from '@/hooks/useCoreContract'
import useUserStore from '@/store/userStore'
import { executeTask, handleTransactionResponse } from '@/helpers/helpers'
import { NotificationInfo } from '@/enums/info'
import { MessageError } from '@/enums/error'
import { createContract } from '@/contract/coreContracts'
import type {
    FollowRefundPool as refundPool,
} from '@/abis/types'
import refundPoolABI from '@/abis/FollowRefundPool.json'
import type { Models } from '@/.generated/api/models'

interface IProps extends ModalProps {
    setOpen: (isOpen: boolean) => void
    tradeId: bigint
    userState: 'loan' | 'lend' | 'market' | 'trade'
    loanState?: Models.LoanState
    loanOwner: string
}

const WithdrawModal: React.FC<IProps> = (props) => {
    const { currentUser } = useUserStore()
    const { coreContracts } = useCoreContract()

    const [withdrawAmount, setWithdrawAmount] = useState(BigInt(0))

    const [approving, setApproving] = useState(false)
    const [approveButtonText, setApproveButtonText] = useState('Approve')
    const [approveButtonDisabled, setApproveButtonDisabled] = useState(true)

    const [withdrawing, setWithdrawing] = useState(false)
    const [withdrawButtonText, setWithdrawButtonText] = useState('Withdraw')
    const [withdrawButtonDisabled, setWithdrawButtonDisabled] = useState(true)

    const [reFundPoolAddressOfLoan, setRefundPoolAddressOfLoan] = useState(ZeroAddress)
    const [tokenId, setTokenId] = useState(BigInt(0))

    const resetModal = () => {
        setApproving(false)
        setApproveButtonText('Approve')
        setApproveButtonDisabled(true)

        setWithdrawing(false)
        setWithdrawButtonText('Withdraw')
        setWithdrawButtonDisabled(true)

        props.setOpen(false)
    }

    const checkAllowance = async (refundPoolAddress: string, tokenId: bigint) => {
        if (coreContracts) {
            setApproving(true)
            setApproveButtonText('Checking...')
            setWithdrawButtonDisabled(true)

            const balance = await coreContracts.sharesContract.tokenIdBalanceOf(tokenId)
            const allowance = await coreContracts.sharesContract.allowance(tokenId, refundPoolAddress)
            console.log(tokenId, refundPoolAddress, balance, allowance)
            if (allowance < balance) {
                setApproveButtonDisabled(false)
            }
            else {
                setApproveButtonDisabled(true)
                setWithdrawButtonDisabled(false)
            }
            setApproving(false)
            setApproveButtonText('Approve')
        }
        else {
            return Promise.reject(MessageError.ProviderOrSignerIsNotInitialized)
        }
    }

    const approve = async () => {
        const task = async () => {
            if (coreContracts) {
                setApproving(true)
                setApproveButtonDisabled(true)
                try {
                    const capitalPoolAddress = await coreContracts.manageContract.getTradeIdToCapitalPool(props.tradeId)
                    const refundPoolAddress = await coreContracts.processCenterContract._getRefundPool(capitalPoolAddress)

                    const res = await coreContracts.sharesContract.approveValue(tokenId, refundPoolAddress, withdrawAmount)
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
                setApproveButtonDisabled(true)
                setWithdrawButtonDisabled(false)
            }
            else {
                return Promise.reject(MessageError.ProviderOrSignerIsNotInitialized)
            }
        }
        executeTask(task)
    }

    const withdraw = async () => {
        const task = async () => {
            if (withdrawButtonText === 'Finish') {
                resetModal()
                return
            }
            if (coreContracts) {
                if (props.userState === 'loan' && currentUser.address === props.loanOwner && props.loanState === 'PaidOff') {
                    const refundPoolContract = createContract<refundPool>(reFundPoolAddressOfLoan, refundPoolABI, coreContracts.signer)
                    const res = await refundPoolContract.borrowerWithdraw(props.tradeId)
                    await handleTransactionResponse(res,
                        NotificationInfo.WithdrawSuccessfully,
                        NotificationInfo.WithdrawSuccessfullyDesc,
                    )
                }
                if (props.userState === 'lend' && props.loanState === 'PaidOff') {
                    setWithdrawing(true)
                    setWithdrawButtonDisabled(true)
                    try {
                        const refundPoolContract = createContract<refundPool>(reFundPoolAddressOfLoan, refundPoolABI, coreContracts.signer)
                        const res = await refundPoolContract.lenderWithdraw(tokenId)
                        await handleTransactionResponse(res,
                            NotificationInfo.WithdrawSuccessfully,
                            NotificationInfo.WithdrawSuccessfullyDesc,
                        )
                    }
                    catch (error) {
                        setWithdrawing(false)
                        setWithdrawButtonDisabled(false)
                        return Promise.reject(error)
                    }
                    setWithdrawing(false)
                    setWithdrawButtonDisabled(false)
                    setWithdrawButtonText('Finish')
                    setWithdrawAmount(BigInt(0))
                }
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
                if (withdrawAmount === BigInt(0)) {
                    const capitalPoolAddress = await coreContracts.manageContract.getTradeIdToCapitalPool(props.tradeId)
                    const refundPoolAddress = await coreContracts.processCenterContract._getRefundPool(capitalPoolAddress)
                    setRefundPoolAddressOfLoan(refundPoolAddress)

                    if (props.userState === 'loan' && props.loanState === 'PaidOff' && currentUser.userId === props.loanOwner) {
                        const profit = await coreContracts.processCenterContract.getBorrowerToProfit(props.tradeId)
                        console.log('profit:', profit)
                        setWithdrawAmount(profit)
                    }
                    if (props.userState === 'lend' && props.loanState === 'PaidOff') {
                        const tokenId = await coreContracts.sharesContract.getPersonalSlotToTokenId(currentUser.address, props.tradeId)
                        setTokenId(tokenId)
                        const profit = await coreContracts.processCenterContract.getUserTotalMoney(tokenId)
                        setWithdrawAmount(profit)
                        checkAllowance(reFundPoolAddressOfLoan, tokenId)
                    }
                }
                else {
                    checkAllowance(reFundPoolAddressOfLoan, tokenId)
                }
            }
            else {
                return Promise.reject(MessageError.ProviderOrSignerIsNotInitialized)
            }
        }
        executeTask(task)
    }, [coreContracts, props.open])

    return <Modal open={props.open}
        onCancel={() => resetModal()}
        okText={props.okText}
        title={'Withdraw'}
        centered={true}
        footer={
            <div className={`${props.userState === 'loan' ? 'flex justify-end' : 'grid grid-cols-2 gap-16'}`} >
                <Button className={`h-40 text-16 ${!approveButtonDisabled ? 'primary-btn' : ''} `} type='primary'
                    loading={approving}
                    disabled={approveButtonDisabled}
                    onClick={approve}
                    hidden={props.userState === 'loan'}
                >{approveButtonText}</Button>
                <Button className={`h-40 text-16 ${!withdrawButtonDisabled ? 'primary-btn' : ''} ${props.userState === 'loan' ? 'w-1/2' : ''} `} type='primary'
                    loading={withdrawing}
                    disabled={withdrawButtonDisabled}
                    onClick={withdraw}
                >{withdrawButtonText}</Button>
            </div >
        }
    >
        <div className='mt-30 h-60 text-16'>
            {
                withdrawAmount === BigInt(0)
                    ? 'You have no profit.'
                    : `You will receive ${formatUnits(withdrawAmount, 18)} USDC`
            }
        </div>
    </Modal >
}

export default WithdrawModal
