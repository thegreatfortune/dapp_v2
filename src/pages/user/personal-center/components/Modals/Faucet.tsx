/* eslint-disable @typescript-eslint/indent */
import type { ModalProps } from 'antd'
import { Button, Modal } from 'antd'
import { useEffect, useState } from 'react'
import { t } from 'i18next'
import { useChainId, useNetwork } from 'wagmi'
import { ethers } from 'ethers'
import useCoreContract from '@/hooks/useCoreContract'
import { executeTask, handleTransactionResponse } from '@/helpers/helpers'
import { NotificationInfo } from '@/enums/info'
import { MessageError } from '@/enums/error'
import { TokenEnums } from '@/enums/chain'

interface IProps extends ModalProps {
    setOpen: (isOpen: boolean) => void
}

const FaucetModal: React.FC<IProps> = (props) => {
    const chainId = useChainId()
    const { chain } = useNetwork()
    const { coreContracts } = useCoreContract()

    const [fauceting, setFauceting] = useState(false)
    const [faucetButtonText, setFaucetButtonText] = useState('Claim')
    const [faucetButtonDisabled, setFaucetButtonDisabled] = useState(true)

    const [faucetText, setFaucetText] = useState(`${t('faucet.claimedText')}${chain?.name}`)

    const resetModal = () => {
        setFauceting(false)
        setFaucetButtonText('Claim')
        setFaucetButtonDisabled(true)
        setFaucetText(`${t('faucet.claimedText')}${chain?.name}`)
        props.setOpen(false)
    }

    const add = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum)
        await provider.send('wallet_watchAsset', {
            type: 'ERC20',
            options: {
                address: TokenEnums[chainId].USDC.address,
                symbol: TokenEnums[chainId].USDC.symbol,
                decimals: TokenEnums[chainId].USDC.decimals,
                // "image": "https://foo.io/token-image.svg"
            },
        })
    }

    const faucet = async () => {
        const task = async () => {
            if (faucetButtonText === 'Finish') {
                resetModal()
                return
            }
            if (coreContracts) {
                setFauceting(true)
                setFaucetButtonDisabled(true)
                setFaucetButtonText('Claiming')
                try {
                    const res = await coreContracts.faucetContract.faucet(TokenEnums[chainId].USDC.address)
                    await handleTransactionResponse(res,
                        NotificationInfo.FaucetSuccessfully,
                        NotificationInfo.FaucetSuccessfullyDesc,
                    )
                }
                catch (error) {
                    setFauceting(false)
                    setFaucetButtonDisabled(false)
                    return Promise.reject(error)
                }
                setFauceting(false)
                setFaucetButtonDisabled(false)
                setFaucetButtonText('Finish')
                setTimeout(() => {
                    resetModal()
                }, 3000)
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
                try {
                    await coreContracts.faucetContract.faucet.staticCall(TokenEnums[chainId].USDC.address)
                }
                catch (error) {
                    // if (error instanceof Error && error.toString().includes('Not withdraw')) {
                    //     setFaucetText(t('faucet.claimedText'))
                    //     setClaimOkButtonDisabled(true)
                    // }
                    console.log(error)
                    return Promise.reject(error)
                }
                setFaucetText(`${t('faucet.claimText')}${chain?.name}`)
                setFaucetButtonDisabled(false)
            }
        }
        if (props.open)
            executeTask(task)
    }, [props.open])

    return <Modal open={props.open}
        onCancel={() => resetModal()}
        title={'Faucet'}
        centered={true}
        footer={
            <div className='grid grid-cols-2 gap-16'>
                <Button className='h-40 text-16 primary-btn' type='primary'
                    onClick={add}
                >Add to wallet</Button>

                <Button className='h-40 text-16 primary-btn' type='primary'
                    loading={fauceting}
                    disabled={faucetButtonDisabled}
                    onClick={faucet}
                >{faucetButtonText}</Button>
            </div>
        }
    >
        <div className='mt-30 h-60 text-16'>
            {faucetText}
        </div>
    </Modal >
}

export default FaucetModal
