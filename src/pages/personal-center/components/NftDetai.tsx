/* eslint-disable @typescript-eslint/indent */
import { useEffect, useState } from 'react'

// import { IntegralRecordService } from '@/.generated/api'
import { Badge, Button, Image, Modal, message } from 'antd'
import { formatUnits } from 'ethers'

// import { BorderOutlined, CheckOutlined, CloseSquareOutlined, LoadingOutlined } from '@ant-design/icons'
import octopus from '@/assets/images/nft/octopus.png'
import dolphin from '@/assets/images/nft/dolphin.png'
import shark from '@/assets/images/nft/shark.png'
import whale from '@/assets/images/nft/whale.png'
import useBrowserContract from '@/hooks/useBrowserContract'

const NftDetail = () => {
    const { browserContractService } = useBrowserContract()

    const [nftBalances, setNftBalances] = useState<bigint[]>([0n, 0n, 0n, 0n])
    const [mintModalOpen, setMintModalOpen] = useState(false)
    const [okText, setOkText] = useState('Mint')
    const [loading, setLoading] = useState(false)
    const [fofChecking, setFofChecking] = useState(false)
    const [mintWithoutWhitelist, setMintWithoutWhitelist] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [disableMintButton, setDisableMintButton] = useState(true)
    const [loadingBtnDisable, setLoadingBtnDisable] = useState(false)
    const [fofCheckingBtnDisable, setFofCheckingBtnDisable] = useState(false)

    const [id, setId] = useState(0)

    const [whitelistResult, setWhitelistResult] = useState('')
    const [fofAmountResult, setFofAmountResult] = useState('')

    const setNftBalance = async () => {
        if (!browserContractService)
            return
        const nftBalances = await browserContractService?.getNftBalance()
        if (nftBalances)
            setNftBalances(nftBalances)
    }
    useEffect(() => {
        setNftBalance()
    }, [browserContractService, refresh])

    const checkWhitelist = async (id: number) => {
        setLoading(true)
        const inWhitelist = await browserContractService!.checkWhitelist(id)
        if (inWhitelist) {
            setWhitelistResult('Congratulations!!! You are in the whitelist!')
            setDisableMintButton(false)
            setLoadingBtnDisable(true)
        }
        else {
            setWhitelistResult('Sorry!!! You are not in the whitelist!')
            setMintWithoutWhitelist(true)
            setLoadingBtnDisable(true)
        }
        setLoading(false)
    }
    const checkFofAmount = async (id: number) => {
        setFofChecking(true)
        const fofBalance = await browserContractService?.getFofBalance()
        // const fofBalance = BigInt('800000000000000000000001')
        switch (id) {
            case 1:
                if ((fofBalance ?? 0) > BigInt('200000000000000000000000')) {
                    setDisableMintButton(false)
                    setFofAmountResult('Congratulations!!! You can mint Dolphin NFT!')
                }
                else {
                    setFofAmountResult('You have not enough $FOF for Dolphin NFT Mint!')
                }
                break
            case 2:
                if ((fofBalance ?? 0) > BigInt('400000000000000000000000')) {
                    setDisableMintButton(false)
                    setFofAmountResult('Congratulations!!! You can mint Shark NFT!')
                }
                else {
                    setFofAmountResult('You have not enough $FOF for Shark NFT Mint!')
                }
                break
            case 3:
                if ((fofBalance ?? 0) > BigInt('800000000000000000000000')) {
                    setDisableMintButton(false)
                    setFofAmountResult('Congratulations!!! You can mint Whale NFT!')
                }
                else {
                    setFofAmountResult('You have not enough $FOF for Whale NFT Mint!')
                }
                break
            case 0:
            default:
                if ((fofBalance ?? 0) > BigInt('100000000000000000000000')) {
                    setDisableMintButton(false)
                    setFofAmountResult('Congratulations!!! You can mint Octopus NFT!')
                }
                else {
                    setFofAmountResult('You have not enough $FOF for Octopus NFT Mint!')
                }
                break
        }
        setFofCheckingBtnDisable(true)
        setFofChecking(false)
    }

    const refreshNFT = () => {
        if (refresh)
            setRefresh(false)
        else
            setRefresh(true)
    }

    const doMint = async () => {
        setDisableMintButton(true)
        try {
            const mintRes = await browserContractService?.mintNft(BigInt(id))
            if (mintRes?.status === 1) {
                setOkText('Finished')
                setTimeout(() => {
                    setMintModalOpen(false)
                    setWhitelistResult('')
                    setMintWithoutWhitelist(false)
                    setId(0)
                    setFofAmountResult('')
                    setDisableMintButton(true)
                    setLoading(false)
                    setFofChecking(false)
                    refreshNFT()
                }, 3000)
                return true
            }
            else {
                throw new Error('Mint Failed!')
            }
        }
        catch (error) {
            setDisableMintButton(false)
            message.error('Transaction Failed')
            return false
        }
    }

    return (<div className='grid grid-cols-1 mt-50 gap-20 lg:grid-cols-4 md:grid-cols-2'>

        <Modal open={mintModalOpen}
            width={700}
            okText={okText}
            onOk={doMint}
            onCancel={() => {
                setWhitelistResult('')
                setMintModalOpen(false)
                setMintWithoutWhitelist(false)
                setId(0)
                setFofAmountResult('')
                setDisableMintButton(true)
                setLoading(false)
                setFofChecking(false)
                setLoadingBtnDisable(false)
                setFofCheckingBtnDisable(false)
            }}
            okButtonProps={{ disabled: disableMintButton, className: 'primary-btn w-100' }}
            cancelButtonProps={{ className: 'w-100' }}
        >
            <div>
                <h2>Mint</h2>
                <div className='my-30 flex justify-between text-18'>
                    <div>{whitelistResult}</div>
                    <Button className='w-180 primary-btn' onClick={() => checkWhitelist(id)} loading={loading} disabled={loadingBtnDisable}>Check Whitelist</Button>
                </div>
                <div className='mb-40 mt-30 flex justify-between text-18' hidden={!mintWithoutWhitelist}>
                    <div>{fofAmountResult}</div>
                    <Button className='w-180 primary-btn' onClick={() => checkFofAmount(id)} loading={fofChecking} disabled={fofCheckingBtnDisable}>Check $FOF Amount</Button>
                </div>
            </div>
        </Modal>

        <div className='flex flex-col items-center justify-center'>
            <div className='card max-w-300 flex items-center justify-center rounded-10'>
                <Badge count={formatUnits(nftBalances[0], 0)} showZero size="default" style={{ backgroundColor: '#5eb6d2' }}>
                    <Image src={octopus} preview={false} className='rounded-10'></Image>
                </Badge>
            </div>
            <div className='m-20 flex justify-center'>
                <Button className='w-120 primary-btn' onClick={() => {
                    setId(0)
                    setMintModalOpen(true)
                }}>Mint</Button>
            </div>
        </div>

        <div className='flex flex-col items-center justify-center'>
            <div className='card max-w-300 flex items-center justify-center rounded-10'>
                <Badge count={formatUnits(nftBalances[1], 0)} showZero size="default" style={{ backgroundColor: '#5eb6d2' }}>
                    <Image src={dolphin} preview={false} className='rounded-10'></Image>
                </Badge>
            </div>
            <div className='m-20 flex justify-center'>
                <Button className='w-120 primary-btn' onClick={() => {
                    setId(1)
                    setMintModalOpen(true)
                }}>Mint</Button>
            </div>
        </div>

        <div className='flex flex-col items-center justify-center'>
            <div className='card max-w-300 flex items-center justify-center rounded-10'>
                <Badge count={formatUnits(nftBalances[2], 0)} showZero size="default" style={{ backgroundColor: '#5eb6d2' }}>
                    <Image src={shark} preview={false} className='rounded-10'></Image>
                </Badge>
            </div>
            <div className='m-20 flex justify-center'>
                <Button className='w-120 primary-btn' onClick={() => {
                    setId(2)
                    setMintModalOpen(true)
                }}>Mint</Button>
            </div>
        </div>

        <div className='flex flex-col items-center justify-center'>
            <div className='card max-w-300 flex items-center justify-center rounded-10'>
                <Badge count={formatUnits(nftBalances[3], 0)} showZero size="default" style={{ backgroundColor: '#5eb6d2' }}>
                    <Image src={whale} preview={false} className='rounded-10'></Image>
                </Badge>
            </div>
            <div className='m-20 flex justify-center'>
                <Button className='w-120 primary-btn' onClick={() => {
                    setId(3)
                    setMintModalOpen(true)
                }}>Mint</Button>
            </div>
        </div>
    </div>)
}

export default NftDetail
