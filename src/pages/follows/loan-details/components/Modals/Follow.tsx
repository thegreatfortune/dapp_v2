/* eslint-disable @typescript-eslint/indent */
import type { ModalProps } from 'antd'
import { Button, Modal, message, notification } from 'antd'
import { MaxUint256, ZeroAddress, formatUnits } from 'ethers'
import { useEffect, useState } from 'react'
import CurrencyInput from 'react-currency-input-field'
import { useChainId } from 'wagmi'
import { ChainAddressEnums, TokenEnums } from '@/enums/chain'
import useCoreContract from '@/hooks/useCoreContract'
import useUserStore from '@/store/userStore'
import { executeTask, handleTransactionResponse } from '@/helpers/helpers'
import { NotificationInfo } from '@/enums/info'
import { MessageError, NotificationError } from '@/enums/error'
import { createContract } from '@/contract/coreContracts'
import type {
    FollowCapitalPool as capitalPool,
} from '@/abis/types'
import capitalPoolABI from '@/abis/FollowCapitalPool.json'

interface IProps extends ModalProps {
    setOpen: (isOpen: boolean) => void
    tradeId: bigint
}

const FollowModal: React.FC<IProps> = (props) => {
    const chainId = useChainId()
    const { currentUser } = useUserStore()
    const { coreContracts } = useCoreContract()

    const [maxShares, setMaxShares] = useState(0)
    const [unitPrice, setUnitPrice] = useState(BigInt(0))
    const [followShares, setFollowShares] = useState(1)
    const [followAmount, setFollowAmount] = useState(BigInt(0))

    const [checkingMax, setCheckingMax] = useState(false)

    const [approving, setApproving] = useState(false)
    const [approveButtonText, setApproveButtonText] = useState('Approve')
    const [approveButtonDisabled, setApproveButtonDisabled] = useState(true)

    const [following, setFollowing] = useState(false)
    const [followButtonText, setFollowButtonText] = useState('Follow')
    const [followButtonDisabled, setFollowButtonDisabled] = useState(true)

    const [capitalPoolAddressOfLoan, setCapitalPoolAddressOfLoan] = useState(ZeroAddress)

    const resetModal = () => {
        setCheckingMax(false)
        setApproving(false)
        setApproveButtonText('Approve')
        setApproveButtonDisabled(true)

        setFollowing(false)
        setFollowButtonText('Follow')
        setFollowButtonDisabled(true)

        setFollowShares(1)
        setFollowAmount(BigInt(0))
        props.setOpen(false)
    }

    const checkAllowance = async (unitPrice?: bigint) => {
        if (coreContracts) {
            setApproving(true)
            setApproveButtonText('Checking...')
            setFollowButtonDisabled(true)

            const allowance = await coreContracts.usdcContract.allowance(currentUser.address, ChainAddressEnums[chainId].processCenter)

            if (allowance < (unitPrice || followAmount)) {
                setApproveButtonDisabled(false)
            }
            else {
                setApproveButtonDisabled(true)
                setFollowButtonDisabled(false)
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
                    const res = await coreContracts.usdcContract.approve(ChainAddressEnums[chainId].processCenter, MaxUint256)
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
                setFollowButtonDisabled(false)
            }
            else {
                return Promise.reject(MessageError.ProviderOrSignerIsNotInitialized)
            }
        }
        executeTask(task)
    }

    const follow = async () => {
        const task = async () => {
            if (followButtonText === 'Finish') {
                resetModal()
                return
            }

            if (coreContracts) {
                setFollowing(true)
                setFollowButtonDisabled(true)

                const balance = await coreContracts.usdcContract.balanceOf(currentUser.address)
                if (balance < followAmount) {
                    notification.error({
                        message: NotificationError.InsufficientBalance,
                        description: NotificationError.InsufficientBalanceDesc,
                        placement: 'bottomRight',
                    })
                    setFollowing(false)
                    setFollowButtonDisabled(false)
                    return
                }

                try {
                    const res = await coreContracts.routerContract.lendMoney(props.tradeId, followShares)
                    await handleTransactionResponse(res,
                        NotificationInfo.FollowSuccessfully,
                        NotificationInfo.FollowSuccessfullyDesc,
                    )
                }
                catch (error) {
                    setFollowing(false)
                    setFollowButtonDisabled(false)
                    return Promise.reject(error)
                }
                setFollowing(false)
                setFollowButtonDisabled(false)
                setFollowButtonText('Finish')
            }
            else {
                // message.error(MessageError.ProviderOrSignerIsNotInitialized)
                return Promise.reject(MessageError.ProviderOrSignerIsNotInitialized)
            }
        }
        executeTask(task)
    }

    const onCheckingMax = async () => {
        const task = async () => {
            setCheckingMax(true)
            const maxAmount = await coreContracts!.processCenterContract.getLendStakeMoney(props.tradeId, maxShares)
            // TODO calculate max follow Amount
            if (maxAmount < BigInt(maxShares) * unitPrice) {
                message.error(MessageError.CalculationResultIsIncorrect)
                return Promise.reject(MessageError.ProviderOrSignerIsNotInitialized)
            }
            setFollowShares(maxShares)
            setFollowAmount(maxAmount)
            setCheckingMax(false)
        }
        executeTask(task)
    }

    const calculateAmount = async (followShares: number) => {
        if (followShares <= maxShares) {
            setApproveButtonText('Checking...')
            setFollowButtonDisabled(true)

            setFollowShares(followShares)
            const amount = await coreContracts!.processCenterContract.getLendStakeMoney(props.tradeId, BigInt(followShares))
            setFollowAmount(amount)

            setApproveButtonText('Approve')
            setFollowButtonDisabled(false)
        }
    }

    useEffect(() => {
        const task = async () => {
            if (coreContracts) {
                const capitalPoolAddress = await coreContracts.manageContract.getTradeIdToCapitalPool(props.tradeId)
                setCapitalPoolAddressOfLoan(capitalPoolAddress)
                const capitalPool = createContract<capitalPool>(capitalPoolAddress, capitalPoolABI, coreContracts.signer)
                setCheckingMax(true)

                const res = await capitalPool.getList(props.tradeId)
                setMaxShares(Number(BigInt(res[7])) - Number(BigInt(res[9])))

                const unitPrice = await coreContracts.processCenterContract.getLendStakeMoney(props.tradeId, 1)
                setUnitPrice(unitPrice)
                setFollowAmount(unitPrice)

                checkAllowance(unitPrice)

                setCheckingMax(false)
            }
        }
        executeTask(task)
    }, [coreContracts])

    useEffect(() => {
        checkAllowance()
    }, [followAmount])

    return <Modal open={props.open}
        onCancel={() => resetModal()}
        okText={props.okText}
        title={'Follow'}
        centered={true}
        footer={
            <div className='grid grid-cols-2 gap-16'>
                <Button className={`h-40 text-16 ${!approveButtonDisabled ? 'primary-btn' : ''}`} type='primary'
                    loading={approving}
                    disabled={approveButtonDisabled}
                    onClick={approve}
                >{approveButtonText}</Button>
                <Button className={`h-40 text-16 ${!followButtonDisabled ? 'primary-btn' : ''}`} type='primary'
                    loading={following}
                    disabled={followButtonDisabled}
                    onClick={follow}
                >{followButtonText}</Button>
            </div>
        }
    >
        <div className='h-350 py-10'>
            <div className='grid grid-rows-2 my-30 gap-4'>
                <div className='text-18'>Lend USDC to Capital Pool:</div>
                <div className='text-14 max-md:mt-5'>{capitalPoolAddressOfLoan}</div>
            </div>
            <div className='grid grid-rows-2 my-30 gap-4'>
                <div className='text-18'>Approve to Follow Process Center:</div>
                <div className='text-14 max-md:mt-5'>{ChainAddressEnums[chainId].processCenter}</div>
            </div>
            <div className='grid grid-rows-2 mb-10 mt-30 gap-4'>
                <div className='mt-15 text-16'>Share amount:</div>
                <div className='mt-3 w-full flex justify-around'>
                    <CurrencyInput
                        className='font-semiBold h-40 w-full border-0 rounded-5 bg-black text-20 text-white outline-1 outline'
                        style={{ outlineColor: '#424242' }}
                        name="depositAmount"
                        value={followShares}
                        placeholder="0"
                        allowDecimals={false}
                        max={maxShares}
                        allowNegativeValue={false}
                        onValueChange={(_value, _name, values) => {
                            if (values && values.value !== '0')
                                calculateAmount(Number(values.value))
                        }}
                    />
                    <div className='ml-20 flex items-center'>
                        <Button type='primary' className='primary-btn' loading={checkingMax} onClick={onCheckingMax} disabled={checkingMax}>Max</Button>
                    </div>
                </div>
            </div>
            <div className='flex justify-end'>
                {followShares} {followShares === 1 ? 'Share' : 'Shares'} = {
                    followShares === 1
                        ? formatUnits(unitPrice, TokenEnums[chainId].USDC.decimals)
                        : formatUnits(followAmount, TokenEnums[chainId].USDC.decimals)
                } USDC
            </div>

        </div>
    </Modal >
}

export default FollowModal
