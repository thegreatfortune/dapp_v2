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

    const [withdrawn, setWithdrawn] = useState(false)
    const [withdrawAmount, setWithdrawAmount] = useState(BigInt(0))

    const [approving, setApproving] = useState(false)
    const [approveButtonText, setApproveButtonText] = useState('Approve')
    const [approveButtonDisabled, setApproveButtonDisabled] = useState(true)

    const [withdrawing, setWithdrawing] = useState(false)
    const [withdrawButtonText, setWithdrawButtonText] = useState('Withdraw')
    const [withdrawButtonDisabled, setWithdrawButtonDisabled] = useState(true)

    const [refundPoolAddressOfLoan, setRefundPoolAddressOfLoan] = useState(ZeroAddress)
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
                setWithdrawing(true)
                setWithdrawButtonDisabled(true)

                const refundPoolContract = createContract<refundPool>(refundPoolAddressOfLoan, refundPoolABI, coreContracts.signer)

                console.log(refundPoolAddressOfLoan)

                try {
                    if (props.userState === 'loan' && props.loanState === 'PaidOff' && currentUser.userId === props.loanOwner) {
                        console.log('111111111111111111111111111111111111111111111')
                        const res = await refundPoolContract.borrowerWithdraw(props.tradeId)
                        await handleTransactionResponse(res,
                            NotificationInfo.WithdrawSuccessfully,
                            NotificationInfo.WithdrawSuccessfullyDesc,
                        )
                    }
                    if (props.userState === 'lend' && props.loanState === 'PaidOff') {
                        const res = await refundPoolContract.lenderWithdraw(tokenId)
                        await handleTransactionResponse(res,
                            NotificationInfo.WithdrawSuccessfully,
                            NotificationInfo.WithdrawSuccessfullyDesc,
                        )
                    }
                }
                catch (error) {
                    setWithdrawing(false)
                    setWithdrawButtonDisabled(false)
                    return Promise.reject(error)
                }

                setWithdrawn(true)
                setWithdrawing(false)
                setWithdrawButtonDisabled(false)
                setWithdrawButtonText('Finish')
                setWithdrawAmount(BigInt(0))
            }
            else {
                return Promise.reject(MessageError.ProviderOrSignerIsNotInitialized)
            }
        }
        executeTask(task)
    }

    useEffect(() => {
        const task = async () => {
            // TODO 第一是 borrower提取过后，检测profit没有变化，withdraw仍是false状态
            // TODO 第二是 lender的withdraw状态，如果领取过后继续follow的话，状态无更新
            if (coreContracts) {
                if (refundPoolAddressOfLoan === ZeroAddress) {
                    const capitalPoolAddress = await coreContracts.manageContract.getTradeIdToCapitalPool(props.tradeId)
                    const refundPoolAddress = await coreContracts.processCenterContract._getRefundPool(capitalPoolAddress)
                    setRefundPoolAddressOfLoan(refundPoolAddress)
                }

                // borrower withdraw profit
                if (props.userState === 'loan' && props.loanState === 'PaidOff' && currentUser.userId === props.loanOwner) {
                    setWithdrawing(true)
                    setWithdrawButtonDisabled(true)
                    setWithdrawButtonText('Checking...')
                    const withdrawn = await coreContracts.processCenterContract._getBorrowerIfWithdrawProfit(currentUser.address, props.tradeId)
                    console.log('borrow withdraw state:', withdrawn)
                    if (!withdrawn) {
                        if (withdrawAmount === BigInt(0)) {
                            // const capitalPoolAddress = await coreContracts.manageContract.getTradeIdToCapitalPool(props.tradeId)
                            // const refundPoolAddress = await coreContracts.processCenterContract._getRefundPool(capitalPoolAddress)
                            // setRefundPoolAddressOfLoan(refundPoolAddress)

                            const profit = await coreContracts.processCenterContract.getBorrowerToProfit(props.tradeId)
                            setWithdrawAmount(profit)
                            if (profit > BigInt(0))
                                setWithdrawButtonDisabled(false)
                        }
                        else {
                            setWithdrawButtonDisabled(false)
                        }
                        setWithdrawing(false)
                        setWithdrawButtonDisabled(false)
                        setWithdrawButtonText('Withdraw')
                    }
                    else {
                        setWithdrawn(true)
                        setWithdrawing(false)
                        setWithdrawButtonDisabled(true)
                        setWithdrawButtonText('Withdraw')
                    }
                }

                // lender withdraw profit
                if (props.userState === 'lend' && props.loanState === 'PaidOff') {
                    setWithdrawing(true)
                    setWithdrawButtonDisabled(true)
                    setWithdrawButtonText('Checking...')
                    const withdrawn = await coreContracts.processCenterContract._getLenderIfWithdrawRefund(currentUser.address, props.tradeId)
                    if (!withdrawn) {
                        if (withdrawAmount === BigInt(0)) {
                            // const capitalPoolAddress = await coreContracts.manageContract.getTradeIdToCapitalPool(props.tradeId)
                            // const refundPoolAddress = await coreContracts.processCenterContract._getRefundPool(capitalPoolAddress)
                            // setRefundPoolAddressOfLoan(refundPoolAddress)
                            const tokenId = await coreContracts.sharesContract.getPersonalSlotToTokenId(currentUser.address, props.tradeId)
                            setTokenId(tokenId)
                            const profit = await coreContracts.processCenterContract.getUserTotalMoney(tokenId)
                            if (profit !== BigInt(0)) {
                                setWithdrawAmount(profit)
                                checkAllowance(refundPoolAddressOfLoan, tokenId)
                            }
                        }
                        else {
                            checkAllowance(refundPoolAddressOfLoan, tokenId)
                        }
                    }
                    else {
                        setWithdrawn(true)
                    }
                    setWithdrawing(false)
                    setWithdrawButtonDisabled(false)
                    setWithdrawButtonText('Withdraw')
                }

                // lender refund
                if (props.userState === 'lend' && props.loanState === 'CloseByUncollected') {
                    //
                    setWithdrawing(true)
                    setWithdrawButtonDisabled(true)
                    setWithdrawButtonText('Checking...')
                    const withdrawn = await coreContracts.processCenterContract._getLenderIfWithdrawRefund(currentUser.address, props.tradeId)
                }
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
            </div>
        }
    >
        <div className='mt-30 h-60 text-16'>
            {
                withdrawn
                    ? 'You have withdrawn.'
                    : withdrawAmount === BigInt(0)
                        ? 'You have no profit.'
                        : `You will receive ${formatUnits(withdrawAmount, 18)} USDC`
            }
        </div>
    </Modal >
}

export default WithdrawModal
