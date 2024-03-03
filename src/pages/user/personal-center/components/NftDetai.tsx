/* eslint-disable @typescript-eslint/indent */
import { useEffect, useState } from 'react'
import { Badge, Button, Image, Modal } from 'antd'
import { formatUnits } from 'ethers'
import { t } from 'i18next'
import octopus from '@/assets/images/nft/octopus.png'
import dolphin from '@/assets/images/nft/dolphin.png'
import shark from '@/assets/images/nft/shark.png'
import whale from '@/assets/images/nft/whale.png'
import useTokenBalance from '@/hooks/useTokenBalance'
import useNftWhitelist from '@/hooks/useNftWhitelist'
import handleTransactionResponse from '@/helpers/handleTransactionResponse'
import useCoreContract from '@/hooks/useCoreContract'
import { NotificationInfo } from '@/enums/info'
import { NFT } from '@/enums/nft'

const NftDetail = () => {
    const { fofBalance, nftBalance, isFinished: tokenBalanceIsChecked } = useTokenBalance()
    const { inWhitelist, isFinished: nftWhitelistIsChecked } = useNftWhitelist()

    const [id, setId] = useState(0)

    const [fofAmountResult, setFofAmountResult] = useState('')

    const { coreContracts } = useCoreContract()

    const [minting, setMinting] = useState(false)

    const [mintModalOpen, setMintModalOpen] = useState(false)

    const [mintOkButtonText, setMintOkButtonText] = useState(`${t('mint')}`)
    const [mintOkButtonDisabled, setMintOkButtonDisabled] = useState(false)
    const [mintOkButtonLoading, setMintOkButtonLoading] = useState(false)
    const [mintCancelButtonHidden, setMintCancalButtonHidden] = useState(false)

    const resetMintModal = () => {
        setMinting(false)
        setId(0)

        setMintOkButtonText(`${t('mint')}`)
        setMintOkButtonDisabled(false)
        setMintOkButtonLoading(false)
        setMintCancalButtonHidden(false)

        setFofAmountResult('')
        setMintModalOpen(false)
    }
    const checkIfFofEnough = async (id: number) => {
        switch (id) {
            case 1:
                if ((fofBalance ?? 0) >= BigInt('200000000000000000000000')) {
                    setMintOkButtonDisabled(false)
                    setFofAmountResult('Congratulations!!! You can mint Dolphin NFT!')
                }
                else {
                    setFofAmountResult('You have not enough $FOF for Dolphin NFT Mint!')
                }
                break
            case 2:
                if ((fofBalance ?? 0) >= BigInt('400000000000000000000000')) {
                    setMintOkButtonDisabled(false)
                    setFofAmountResult('Congratulations!!! You can mint Shark NFT!')
                }
                else {
                    setFofAmountResult('You have not enough $FOF for Shark NFT Mint!')
                }
                break
            case 3:
                if ((fofBalance ?? 0) >= BigInt('800000000000000000000000')) {
                    setMintOkButtonDisabled(false)
                    setFofAmountResult('Congratulations!!! You can mint Whale NFT!')
                }
                else {
                    setFofAmountResult('You have not enough $FOF for Whale NFT Mint!')
                }
                break
            case 0:
            default:
                if ((fofBalance ?? 0) >= BigInt('100000000000000000000000')) {
                    setMintOkButtonDisabled(false)
                    setFofAmountResult('Congratulations!!! You can mint Octopus NFT!')
                }
                else {
                    setFofAmountResult('You have not enough $FOF for Octopus NFT Mint!')
                }
                break
        }
    }

    const doMint = async () => {
        if (mintOkButtonText === t('completed')) {
            resetMintModal()
            return true
        }
        setMintOkButtonDisabled(true)
        setMintOkButtonLoading(true)
        if (coreContracts) {
            try {
                const res = await coreContracts.nftContract.doMint(id, 1)
                await handleTransactionResponse(res, NotificationInfo.MintSuccessfully, NotificationInfo.MintSuccessfullyDesc)
                setMintOkButtonText(`${t('completed')}`)
                setTimeout(() => {
                    resetMintModal()
                }, 3000)
                return true
            }
            catch (error) {
                setMintOkButtonText(`${t('mint')}`)
                setMintOkButtonDisabled(false)
                setMintOkButtonLoading(false)
                setMintCancalButtonHidden(false)
            }
        }
        return false
    }

    useEffect(() => {
        if (minting && tokenBalanceIsChecked && nftWhitelistIsChecked)
            setMintModalOpen(true)
    }, [minting, tokenBalanceIsChecked, nftWhitelistIsChecked])

    return (<div className='grid grid-cols-1 mt-50 gap-20 lg:grid-cols-4 md:grid-cols-2'>
        <Modal open={mintModalOpen}
            width={700}
            okText={mintOkButtonText}
            onOk={() => doMint()}
            onCancel={() => resetMintModal()}
            okButtonProps={{ disabled: mintOkButtonDisabled, className: 'primary-btn w-100', loading: mintOkButtonLoading }}
            cancelButtonProps={{ hidden: mintCancelButtonHidden, className: 'w-100' }}
        >
            <div>
                <h2>Mint</h2>
                <div className='my-30 flex justify-between text-18'>
                    <div>{inWhitelist[id] ? `${t('nft.mint.text.success')}${NFT[id]} card!` : `${t('nft.mint.text.fail')}${NFT[id]} card!`}</div>
                    {/* <Button className='w-180 primary-btn' onClick={() => checkWhitelist(id)} loading={loading} disabled={loadingBtnDisable}>Check Whitelist</Button> */}
                </div>
                <div className='mb-40 mt-30 flex justify-between text-18' hidden={inWhitelist[id]}>
                    <div>{fofAmountResult}</div>
                    <Button className='w-180 primary-btn' onClick={() => checkIfFofEnough(id)} >Check $FOF Amount</Button>
                </div>
            </div>
        </Modal>

        <div className='flex flex-col items-center justify-center'>
            <div className='card max-w-300 flex items-center justify-center rounded-10'>
                <Badge count={formatUnits(nftBalance[0], 0)} showZero size="default" style={{ backgroundColor: '#5eb6d2' }}>
                    <Image src={octopus} preview={false} className='rounded-10'></Image>
                </Badge>
            </div>
            <div className='m-20 flex justify-center'>
                <Button className='w-120 primary-btn'
                    loading={minting}
                    onClick={() => {
                        setId(0)
                        setMintOkButtonDisabled(!inWhitelist[0])
                        setMinting(true)
                        // setMintModalOpen(true)
                    }}>Mint</Button>
            </div>
        </div>

        <div className='flex flex-col items-center justify-center'>
            <div className='card max-w-300 flex items-center justify-center rounded-10'>
                <Badge count={formatUnits(nftBalance[1], 0)} showZero size="default" style={{ backgroundColor: '#5eb6d2' }}>
                    <Image src={dolphin} preview={false} className='rounded-10'></Image>
                </Badge>
            </div>
            <div className='m-20 flex justify-center'>
                <Button className='w-120 primary-btn' onClick={() => {
                    setId(1)
                    setMintOkButtonDisabled(!inWhitelist[1])
                    setMintModalOpen(true)
                }}>Mint</Button>
            </div>
        </div>

        <div className='flex flex-col items-center justify-center'>
            <div className='card max-w-300 flex items-center justify-center rounded-10'>
                <Badge count={formatUnits(nftBalance[2], 0)} showZero size="default" style={{ backgroundColor: '#5eb6d2' }}>
                    <Image src={shark} preview={false} className='rounded-10'></Image>
                </Badge>
            </div>
            <div className='m-20 flex justify-center'>
                <Button className='w-120 primary-btn' onClick={() => {
                    setId(2)
                    setMintOkButtonDisabled(!inWhitelist[2])
                    setMintModalOpen(true)
                }}>Mint</Button>
            </div>
        </div>

        <div className='flex flex-col items-center justify-center'>
            <div className='card max-w-300 flex items-center justify-center rounded-10'>
                <Badge count={formatUnits(nftBalance[3], 0)} showZero size="default" style={{ backgroundColor: '#5eb6d2' }}>
                    <Image src={whale} preview={false} className='rounded-10'></Image>
                </Badge>
            </div>
            <div className='m-20 flex justify-center'>
                <Button className='w-120 primary-btn' onClick={() => {
                    setId(3)
                    setMintOkButtonDisabled(!inWhitelist[3])
                    setMintModalOpen(true)
                }}>Mint</Button>
            </div>
        </div>
    </div >)
}

export default NftDetail
