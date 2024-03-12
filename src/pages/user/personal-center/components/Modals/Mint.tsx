/* eslint-disable @typescript-eslint/indent */
import type { ModalProps } from 'antd'
import { Button, Modal } from 'antd'
import { useEffect, useState } from 'react'
import { t } from 'i18next'
import useCoreContract from '@/hooks/useCoreContract'
import { executeTask, handleTransactionResponse } from '@/helpers/helpers'
import { NotificationInfo } from '@/enums/info'
import { MessageError } from '@/enums/error'
import useNftWhitelist from '@/hooks/useNftWhitelist'
import useTokenBalance from '@/hooks/useTokenBalance'

interface IProps extends ModalProps {
    setOpen: (isOpen: boolean) => void
    id: number
}

const MintModal: React.FC<IProps> = (props) => {
    const { coreContracts } = useCoreContract()
    const { inWhitelist, isFinished: whitelistIsChecked } = useNftWhitelist()
    const { fofBalance, isFinished: balanceIsChecked } = useTokenBalance()

    const [checking, setChecking] = useState(true)
    const [checkButtonText, setCheckButtonText] = useState('Check eligibility')
    const [checkButtonDisabled, setCheckButtonDisabled] = useState(false)

    const [minting, setMinting] = useState(false)
    const [mintButtonText, setMintButtonText] = useState('Mint')
    const [mintButtonDisabled, setMintButtonDisabled] = useState(true)

    const [mintText, setMintText] = useState('Pleas check your eligiablity.')

    const resetModal = () => {
        setMinting(false)
        setMintButtonText('Mint')
        setMintButtonDisabled(true)
        setMintText('Pleas check your eligiablity.')
        setChecking(false)
        props.setOpen(false)
    }

    const check = async () => {
        const task = async () => {
            if (coreContracts && whitelistIsChecked) {
                setChecking(true)
                setCheckButtonText('Checking...')
                setCheckButtonDisabled(true)
                const isWhitelist = inWhitelist[props.id]
                if (isWhitelist) {
                    setMintButtonDisabled(false)
                    setMintText('Congratulations!!! You have the eligibility!')
                }
                else {
                    if (balanceIsChecked) {
                        switch (props.id) {
                            case 1:
                                if ((fofBalance ?? 0) >= BigInt('200000000000000000000000')) {
                                    setMintButtonDisabled(false)
                                    setMintText('Congratulations!!! You can mint Dolphin NFT!')
                                }
                                else {
                                    setMintText('You have not enough $FOF Token for Dolphin NFT Mint!')
                                }
                                break
                            case 2:
                                if ((fofBalance ?? 0) >= BigInt('400000000000000000000000')) {
                                    setMintButtonDisabled(false)
                                    setMintText('Congratulations!!! You can mint Shark NFT!')
                                }
                                else {
                                    setMintText('You have not enough $FOF Token for Shark NFT Mint!')
                                }
                                break
                            case 3:
                                if ((fofBalance ?? 0) >= BigInt('800000000000000000000000')) {
                                    setMintButtonDisabled(false)
                                    setMintText('Congratulations!!! You can mint Whale NFT!')
                                }
                                else {
                                    setMintText('You have not enough $FOF Token for Whale NFT Mint!')
                                }
                                break
                            case 0:
                            default:
                                if ((fofBalance ?? 0) >= BigInt('100000000000000000000000')) {
                                    setMintButtonDisabled(false)
                                    setMintText('Congratulations!!! You can mint Octopus NFT!')
                                }
                                else {
                                    setMintText('You have not enough $FOF Token for Octopus NFT Mint!')
                                }
                                break
                        }
                    }
                }
                setChecking(false)
                setCheckButtonText('Check eligibility')
                setCheckButtonDisabled(false)
            }
        }
        executeTask(task)
    }

    const mint = async () => {
        const task = async () => {
            if (mintButtonText === 'Finish') {
                resetModal()
                return
            }
            if (coreContracts) {
                if (mintButtonText === t('completed')) {
                    resetModal()
                    return true
                }
                setMintButtonDisabled(true)
                setMinting(true)
                if (coreContracts) {
                    try {
                        const res = await coreContracts.nftContract.doMint(props.id, 1)
                        await handleTransactionResponse(res,
                            NotificationInfo.MintSuccessfully,
                            NotificationInfo.MintSuccessfullyDesc,
                        )
                        setMintButtonText(`${t('completed')}`)
                        setTimeout(() => {
                            resetModal()
                        }, 3000)
                    }
                    catch (error) {
                        setMintButtonText(`${t('mint')}`)
                        setMintButtonDisabled(false)
                        setMinting(false)
                    }
                }
                return false
            }
            else {
                return Promise.reject(MessageError.ProviderOrSignerIsNotInitialized)
            }
        }
        executeTask(task)
    }

    useEffect(() => {
        if (whitelistIsChecked && balanceIsChecked)
            setChecking(false)
    }, [coreContracts, whitelistIsChecked, balanceIsChecked])

    return <Modal open={props.open}
        onCancel={() => resetModal()}
        title={'Mint'}
        centered={true}
        footer={
            <div className='grid grid-cols-2 gap-16'>
                <Button className='h-40 text-16 primary-btn' type='primary'
                    loading={checking}
                    disabled={checkButtonDisabled}
                    onClick={check}
                >{checkButtonText}</Button>

                <Button className='h-40 text-16 primary-btn' type='primary'
                    loading={minting}
                    disabled={mintButtonDisabled}
                    onClick={mint}
                >{mintButtonText}</Button>
            </div>
        }
    >
        <div className='mt-30 h-60 text-16'>
            {mintText}
        </div>
    </Modal >
}

export default MintModal
