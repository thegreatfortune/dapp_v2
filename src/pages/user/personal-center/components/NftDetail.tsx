/* eslint-disable @typescript-eslint/indent */
import { useState } from 'react'
import { Badge, Button, Image } from 'antd'
import { formatUnits } from 'ethers'
import MintModal from './Modals/Mint'
import octopus from '@/assets/images/nft/octopus.png'
import dolphin from '@/assets/images/nft/dolphin.png'
import shark from '@/assets/images/nft/shark.png'
import whale from '@/assets/images/nft/whale.png'
import useTokenBalance from '@/hooks/useTokenBalance'
import useUserStore from '@/store/userStore'

const NftEnums: { [key: number]: string } = {
    0: octopus,
    1: dolphin,
    2: shark,
    3: whale,
}

const NftDetail = () => {
    const { currentUser } = useUserStore()

    const { nftBalance, isFinished } = useTokenBalance()

    const [id, setId] = useState(0)

    const [mintModalOpen, setMintModalOpen] = useState(false)

    const NftCard = (id: number) => {
        return (
            <div className='flex flex-col items-center justify-center' key={id}>
                <div className='card max-w-300 flex items-center justify-center rounded-10'>
                    <Badge count={isFinished ? formatUnits(nftBalance[id], 0) : 0} showZero size="default" style={{ backgroundColor: '#5eb6d2' }}>
                        <Image src={NftEnums[id]} preview={false} className='rounded-10'></Image>
                    </Badge>
                </div>
                <div className='m-20 flex justify-center'>
                    <Button className='w-120 primary-btn'
                        onClick={() => {
                            setId(id)
                            setMintModalOpen(true)
                        }}
                        type='primary'
                    >Mint</Button>
                </div>
            </div>
        )
    }

    return (<div className='grid grid-cols-1 mt-50 gap-20 lg:grid-cols-4 md:grid-cols-2'>

        <MintModal open={mintModalOpen}
            setOpen={setMintModalOpen}
            id={id}
            key={currentUser.address}
        ></MintModal>

        {
            nftBalance.map((_, index) => {
                return NftCard(index)
            })
        }
    </div >)
}

export default NftDetail
