/* eslint-disable @typescript-eslint/indent */
import { useEffect, useState } from 'react'

// import { IntegralRecordService } from '@/.generated/api'
import { Badge, Button, Image, Modal, message } from 'antd'
import { formatUnits } from 'ethers'
import { BorderOutlined, CheckOutlined, CloseSquareOutlined, LoadingOutlined } from '@ant-design/icons'
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
    const [canMint, setCanMint] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [disableMintButton, setDisableMintButton] = useState(true)

    const [id, setId] = useState(0)

    const [whitelistResult, setWhitelistResult] = useState('')
    const [fofAmountResult, setFofAmountResult] = useState('')

    const [approved, setApproved] = useState(0)
    const [mint, setMint] = useState(0)

    useEffect(() => {
        async function setNftBalance() {
            console.log('refreshed')
            const nftBalances = await browserContractService?.getNftBalance()
            if (nftBalances)
                setNftBalances(nftBalances)
        }
        setNftBalance()
    }, [refresh])

    const checkWhitelist = async () => {
        setLoading(true)
        const inWhitelist = await browserContractService!.checkWhitelist()
        if (inWhitelist) {
            setWhitelistResult('Congratulations!!! You are in the whitelist!')
            setDisableMintButton(false)
        }
        else {
            setWhitelistResult('Sorry!!! You are not in the whitelist!')
            setMintWithoutWhitelist(true)
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
                    setCanMint(true)
                    setDisableMintButton(false)
                    setFofAmountResult('Congratulations!!! You can mint Dolphin NFT!')
                }
                else {
                    setFofAmountResult('You have not enough $FOF for Dolphin NFT Mint!')
                }
                break
            case 2:
                if ((fofBalance ?? 0) > BigInt('400000000000000000000000')) {
                    setCanMint(true)
                    setDisableMintButton(false)
                    setFofAmountResult('Congratulations!!! You can mint Shark NFT!')
                }
                else {
                    setFofAmountResult('You have not enough $FOF for Shark NFT Mint!')
                }
                break
            case 3:
                if ((fofBalance ?? 0) > BigInt('800000000000000000000000')) {
                    setCanMint(true)
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
                    setCanMint(true)
                    setDisableMintButton(false)
                    setFofAmountResult('Congratulations!!! You can mint Octopus NFT!')
                }
                else {
                    setFofAmountResult('You have not enough $FOF for Octopus NFT Mint!')
                }
                break
        }
        setFofChecking(false)
    }

    const refreshNFT = () => {
        if (refresh)
            setRefresh(false)
        else
            setRefresh(true)
    }

    const doMint = async () => {
        setApproved(1)
        setDisableMintButton(true)
        try {
            if (approved !== 2) {
                const approveRes = await browserContractService?.approveFofForERC1155(BigInt('100000000000000000000000') * BigInt(2 ** id))
                if (approveRes?.status === 1)
                    setApproved(2)
                else
                    throw new Error('Approval Failed')
            }
        }
        catch (error) {
            setApproved(3)
            setDisableMintButton(false)
            message.error('Transaction Failed')
            return false
        }
        try {
            const mintRes = await browserContractService?.mintNft(BigInt(id))
            if (mintRes?.status === 1) {
                // setPoolIsCreated(true)
                setMint(2)
                setOkText('Finished')
                setTimeout(() => {
                    setMintModalOpen(false)
                    setWhitelistResult('')
                    setMintWithoutWhitelist(false)
                    setCanMint(false)
                    setId(0)
                    setFofAmountResult('')
                    setApproved(0)
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
            setMint(3)
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
                setCanMint(false)
                setId(0)
                setFofAmountResult('')
                setApproved(0)
                setDisableMintButton(true)
                setLoading(false)
                setFofChecking(false)
            }}
            okButtonProps={{ disabled: disableMintButton, className: 'primary-btn w-100' }}
            cancelButtonProps={{ className: 'w-100' }}
        >
            <div>
                <h2>Mint</h2>
                <div className='mx-10 my-20 flex justify-between text-18'>
                    <Button className='w-180 primary-btn' onClick={checkWhitelist} loading={loading}>Check Whitelist</Button>
                    <div>{whitelistResult}</div>
                </div>
                <div className='mx-10 my-20 flex justify-between text-18' hidden={!mintWithoutWhitelist}>
                    <Button className='w-180 primary-btn' onClick={() => checkFofAmount(id)} loading={fofChecking}>Check $FOF Amount</Button>
                    <div>{fofAmountResult}</div>
                </div>

                <div className='mx-10 my-20 text-18' hidden={!canMint}>
                    {
                        approved === 0
                            ? <div className='flex items-center justify-between'>
                                <div className='flex'>
                                    <div className='mr-8'>1.</div>Approve your $FOF token</div>
                                <div className='m-8'><BorderOutlined /></div>
                            </div>
                            : approved === 1
                                ? <div className='flex items-center justify-between'>
                                    <div className='flex'>
                                        <div className='mr-8'>1.</div>Approving your $FOF token...</div>
                                    <div className='m-8'><LoadingOutlined /></div>
                                </div>
                                : approved === 2
                                    ? <div className='flex items-center justify-between'>
                                        <div className='flex'>
                                            <div className='mr-8'>1.</div>Approved for mint NFT!</div>
                                        <div className='m-8'><CheckOutlined className='text-green-500' /></div>
                                    </div>
                                    : <div className='flex items-center justify-between'>
                                        <div className='flex'>
                                            <div className='mr-8'>1.</div>Approval failed!</div>
                                        <div className='m-8'><CloseSquareOutlined className='text-red-500' /></div>
                                    </div>
                    }
                </div>
                <div className='mx-10 my-20 text-18' hidden={!canMint}>
                    {
                        mint === 0
                            ? <div className='flex items-center justify-between'>
                                <div className='flex'>
                                    <div className='mr-8'>2.</div>Mint</div>
                                <div className='m-8'><BorderOutlined /></div>
                            </div>
                            : mint === 1
                                ? <div className='flex items-center justify-between'>
                                    <div className='flex'>
                                        <div className='mr-8'>1.</div>Minting...</div>
                                    <div className='m-8'><LoadingOutlined /></div>
                                </div>
                                : mint === 2
                                    ? <div className='flex items-center justify-between'>
                                        <div className='flex'>
                                            <div className='mr-8'>1.</div>Mint successfully!</div>
                                        <div className='m-8'><CheckOutlined className='text-green-500' /></div>
                                    </div>
                                    : <div className='flex items-center justify-between'>
                                        <div className='flex'>
                                            <div className='mr-8'>1.</div>Mint failed!</div>
                                        <div className='m-8'><CloseSquareOutlined className='text-red-500' /></div>
                                    </div>
                    }
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
