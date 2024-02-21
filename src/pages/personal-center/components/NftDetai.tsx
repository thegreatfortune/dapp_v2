/* eslint-disable @typescript-eslint/indent */
import { useState } from 'react'

// import { IntegralRecordService } from '@/.generated/api'
import { Badge, Button, Image } from 'antd'
import useUserStore from '@/store/userStore'

// import ScrollableList from '@/pages/components/ScrollabletList'

import octopus from '@/assets/images/nft/octopus.png'
import dolphin from '@/assets/images/nft/dolphin.png'
import shark from '@/assets/images/nft/shark.png'
import whale from '@/assets/images/nft/whale.png'

const NftDetail = () => {
    const { activeUser } = useUserStore()

    const [octopusNum, setOctopusNum] = useState(0)
    const [dolphinNum, setDolphinNum] = useState(0)
    const [sharkNum, setSharkNum] = useState(0)
    const [whaleNum, setWhaleNum] = useState(0)

    return (<div className='grid grid-cols-1 mt-50 gap-20 lg:grid-cols-4 md:grid-cols-2'>

        <div className='flex flex-col items-center justify-center'>
            <div className='card max-w-300 flex items-center justify-center rounded-10'>
                <Badge count={octopusNum} showZero size="default" style={{ backgroundColor: '#5eb6d2' }}>
                    <Image src={octopus} preview={false} className='rounded-10'></Image>
                </Badge>
            </div>
            <div className='m-20 flex justify-center'>
                <Button className='w-120 primary-btn'>Mint</Button>
            </div>
        </div>

        <div className='flex flex-col items-center justify-center'>
            <div className='card max-w-300 flex items-center justify-center rounded-10'>
                <Badge count={dolphinNum} showZero size="default" style={{ backgroundColor: '#5eb6d2' }}>
                    <Image src={dolphin} preview={false} className='rounded-10'></Image>
                </Badge>
            </div>
            <div className='m-20 flex justify-center'>
                <Button className='w-120 primary-btn'>Mint</Button>
            </div>
        </div>

        <div className='flex flex-col items-center justify-center'>
            <div className='card max-w-300 flex items-center justify-center rounded-10'>
                <Badge count={sharkNum} showZero size="default" style={{ backgroundColor: '#5eb6d2' }}>
                    <Image src={shark} preview={false} className='rounded-10'></Image>
                </Badge>
            </div>
            <div className='m-20 flex justify-center'>
                <Button className='w-120 primary-btn'>Mint</Button>
            </div>
        </div>

        <div className='flex flex-col items-center justify-center'>
            <div className='card max-w-300 flex items-center justify-center rounded-10'>
                <Badge count={whaleNum} showZero size="default" style={{ backgroundColor: '#5eb6d2' }}>
                    <Image src={whale} preview={false} className='rounded-10'></Image>
                </Badge>
            </div>
            <div className='m-20 flex justify-center'>
                <Button className='w-120 primary-btn'>Mint</Button>
            </div>
        </div>
    </div>)
}

export default NftDetail
