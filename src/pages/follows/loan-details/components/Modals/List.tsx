/* eslint-disable @typescript-eslint/indent */
import type { ModalProps } from 'antd'
import { Button, Modal } from 'antd'
import { useEffect, useState } from 'react'
import CurrencyInput from 'react-currency-input-field'
import { useChainId } from 'wagmi'
import { parseUnits } from 'ethers'
import useCoreContract from '@/hooks/useCoreContract'
import { executeTask, handleTransactionResponse } from '@/helpers/helpers'
import { NotificationInfo } from '@/enums/info'
import { MessageError } from '@/enums/error'
import useUserStore from '@/store/userStore'
import { ChainAddressEnums } from '@/enums/chain'

interface IProps extends ModalProps {
    setOpen: (isOpen: boolean) => void
    tradeId: number
}

const ListModal: React.FC<IProps> = (props) => {
    const chainId = useChainId()
    const { coreContracts } = useCoreContract()
    const { currentUser } = useUserStore()

    const [tokenId, setTokenId] = useState(BigInt(0))
    const [shareBalance, setShareBalance] = useState(BigInt(0))
    const [listShares, setListShares] = useState(BigInt(0))
    const [sharePrice, setSharePrice] = useState('0.0')
    const [totalPrice, setTotalPrice] = useState('0.0')

    // const [claimed, setClaimed] = useState(false)
    // const [claimAmount, setClaimAmount] = useState(BigInt(0))

    const [approving, setApproving] = useState(false)
    const [approveButtonText, setApproveButtonText] = useState('Approve')
    const [approveButtonDisabled, setApproveButtonDisabled] = useState(true)

    const [listing, setListing] = useState(false)
    const [listButtonText, setListButtonText] = useState('List')
    const [listButtonDisabled, setListButtonDisabled] = useState(true)

    const resetModal = () => {
        setListing(false)
        setListButtonText('Claim')
        setListButtonDisabled(true)

        props.setOpen(false)
    }

    const checkAllowance = async () => {
        if (coreContracts) {
            setApproving(true)
            setApproveButtonText('Checking...')
            setListButtonDisabled(true)
            console.log('allowance')
            const allowance = await coreContracts.sharesContract.allowance(tokenId, ChainAddressEnums[chainId].market)

            if (allowance < listShares) {
                setApproveButtonDisabled(false)
            }
            else {
                setApproveButtonDisabled(true)
                setListButtonDisabled(false)
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
                    const res = await coreContracts.sharesContract.approveValue(tokenId, ChainAddressEnums[chainId].market, listShares)
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
                setListButtonDisabled(false)
            }
            else {
                return Promise.reject(MessageError.ProviderOrSignerIsNotInitialized)
            }
        }
        executeTask(task)
    }

    const list = async () => {
        const task = async () => {
            if (listButtonText === 'Finish') {
                resetModal()
                return
            }
            if (coreContracts) {
                setListing(true)
                setListButtonDisabled(true)
                console.log(tokenId, parseUnits(sharePrice, 4), listShares)
                try {
                    const res = await coreContracts.marketContract.saleERC3525(tokenId, parseUnits(sharePrice, 4), listShares)
                    await handleTransactionResponse(res,
                        NotificationInfo.ListSuccessfully,
                        NotificationInfo.ListSuccessfullyDesc,
                    )
                }
                catch (error) {
                    setListing(false)
                    setListButtonDisabled(false)
                    return Promise.reject(error)
                }
                setListing(false)
                setListButtonDisabled(false)
                setListButtonText('Finish')
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
                const tokenId = await coreContracts.sharesContract.getPersonalSlotToTokenId(currentUser.address, props.tradeId)
                setTokenId(tokenId)
                const shareBalance = await coreContracts.sharesContract.tokenIdBalanceOf(tokenId)
                if (shareBalance !== BigInt(0)) {
                    setShareBalance(shareBalance)
                    setListButtonDisabled(false)
                }
            }
        }
        executeTask(task)
    }, [coreContracts, props.open])

    useEffect(() => {
        checkAllowance()
    }, [listShares])

    return <Modal open={props.open}
        onCancel={() => resetModal()}
        title={'List to share market'}
        centered={true}
        footer={
            <div className='grid grid-cols-2 gap-16'>
                <Button className={`h-40 text-16 ${!approveButtonDisabled ? 'primary-btn' : ''}`} type='primary'
                    loading={approving}
                    disabled={approveButtonDisabled}
                    onClick={approve}
                >{approveButtonText}</Button>
                <Button className={`h-40 text-16 ${!listButtonDisabled ? 'primary-btn' : ''}`} type='primary'
                    loading={listing}
                    disabled={listButtonDisabled}
                    onClick={list}
                >{listButtonText}</Button>
            </div>
        }
    >
        <div className='h-400 py-10'>
            <div className='grid grid-rows-2 mb-20 mt-30 gap-4'>
                <div className='text-18'>Approve to Follow Market:</div>
                <div className='text-14 max-md:mt-5'>{ChainAddressEnums[chainId].market}</div>
            </div>
            <div className='grid grid-rows-2 gap-4'>
                <div className='mt-15 text-16'>List amount:</div>
                <div className='mt-3 w-full flex justify-around'>
                    <CurrencyInput
                        className='font-semiBold h-40 w-full border-0 rounded-5 bg-black text-20 text-white outline-1 outline disabled:bg-black:0.1'
                        style={{ outlineColor: '#424242' }}
                        name="listShares"
                        value={Number(listShares) === 0 ? '' : Number(listShares)}
                        placeholder="0"
                        disabled={Number(shareBalance) === 0}
                        allowDecimals={false}
                        max={Number(shareBalance)}
                        allowNegativeValue={false}
                        onValueChange={(_value, _name, values) => {
                            if (values) {
                                if (Number(values.value) <= Number(shareBalance)) {
                                    setListShares(BigInt(values.value))
                                    setTotalPrice((Number(values.value) * Number(sharePrice)).toString())
                                }
                            }
                        }}
                    />
                    <div className='ml-20 flex items-center'>
                        <Button type='primary' disabled={Number(shareBalance) === 0} className='primary-btn'
                            onClick={() => setListShares(shareBalance)}>Max</Button>
                    </div>
                </div>
                <div className='mt-10 flex justify-end'>
                    <div>Balance:</div>
                    <div className='ml-20'>{shareBalance.toString()} shares</div>
                </div>
            </div>
            <div className='grid grid-rows-2 gap-4'>
                <div className='mt-15 text-16'>Share Price:</div>
                <div className='mt-3 w-full flex justify-around'>
                    <CurrencyInput
                        className='font-semiBold h-40 w-full border-0 rounded-5 bg-black text-20 text-white outline-1 outline disabled:bg-black:0.1'
                        style={{ outlineColor: '#424242' }}
                        name="listShares"
                        value={sharePrice === '0.0' ? '' : sharePrice}
                        placeholder="0"
                        disabled={Number(shareBalance) === 0}
                        decimalsLimit={4}
                        allowNegativeValue={false}
                        onValueChange={(_value, _name, values) => {
                            if (values) {
                                setSharePrice(values.value)
                                setTotalPrice((Number(values.value) * Number(listShares)).toString())
                            }
                        }}
                    />
                    <div className='ml-40 flex items-center'>
                        USDC
                    </div>
                </div>
                <div className='mt-10 flex justify-end text-18'>
                    <div>You will list {listShares.toString()} share for total {totalPrice} USDC</div>
                    {/* <div className='ml-20'>{shareBalance.toString()} shares</div> */}
                </div>
            </div>
            <div className='flex justify-end'>
                {/* {followShares} {followShares === 1 ? 'Share' : 'Shares'} = {
                    followShares === 1
                        ? formatUnits(unitPrice, TokenEnums[chainId].USDC.decimals)
                        : formatUnits(followAmount, TokenEnums[chainId].USDC.decimals)
                } USDC */}
            </div>
        </div>
    </Modal >
}

export default ListModal
