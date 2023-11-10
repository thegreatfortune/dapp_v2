import Button from 'antd/es/button'
import Carousel from 'antd/es/carousel'
import Avatar from 'antd/es/avatar'
import { useEffect } from 'react'
import bannerImg from '../../assets/images/banner.png'
import { BrowserContractService } from '@/contract/BrowserContractService'

interface CardProps {
  imageSrc: string
  title: string
  description: string
}

interface CustomAvatarProps {
  src: string
  name: string
  twitter: string
}

const CustomAvatar: React.FC<CustomAvatarProps> = ({ src, name, twitter }) => {
  return (
    <div className="flex items-center">
      <Avatar src={src} className='h40 w40' />
      <div className="ml-4">
        <h2 className="m0 p0 text-14 font-semibold">{name}</h2>
        <span className="text-12 text-gray-500">@{twitter}</span>
      </div>
    </div>
  )
}

const TransparentCard: React.FC<CardProps> = ({ imageSrc, title, description }) => {
  return (
    <div className="box-border h-429 w-315 flex flex-col border-2 border-#303241 rounded-16 border-solid bg-[#171822] p-24">
      <img
        src={imageSrc}
        alt={title}
        className="h-232 w-266 rounded-16 object-cover"
      />
      <div className='text-left'>
        <div className='h11 w-full'></div>
        <h2 className="m0 h35 p0 text-24 font-semibold c-#37A4F8">{title}</h2>

        <div className='flex justify-between'>
          <ul className='m0 flex flex-col list-none gap-8 p0'>
            <li className='h18 flex flex-col text-14 c-#999999'>
              Apply for loan
            </li>
            <li className='h29 text-16 c-#FFFFFF'>
              5632 USDT
            </li>
            <li>
              <CustomAvatar src={'xsxas'} name={'xasxsa'} twitter={'xsaxas'} />
            </li>
          </ul>

          <ul className='m0 flex flex-col list-none gap-8 p0'>
            <li className='h18 flex flex-col text-14 c-#999999'>
              Risk level
            </li>
            <li className='h29 text-16 c-#FFFFFF'>
              low
            </li>
            <li>
              <Button className='mt-10 h30 w-110 text-12 primary-btn'>Follow</Button>
            </li>
          </ul>

        </div>
      </div>
    </div>
  )
}

const CardsContainer = () => {
  useEffect(() => {
    const mounted = async () => {
      const processCenterContract = await BrowserContractService.getProcessCenterContract()

      // processCenterContract.
    }
    mounted()
  }, [])

  return (<div>
    <div className='h48 flex items-center justify-between'>
      <div>
        <h2 className='font-size-34'>
          Title
        </h2>
      </div>

      <div className='font-size-24 c-[#D2D2D2]'>
        view all {'>>'}
      </div>
    </div>

    <div className='h23 w-full'></div>

    <div className='flex flex-wrap gap-x-46 gap-y-50'>
      {
        Array.from(Array.from({ length: 10 }).keys()).map(e => <div key={e} > <TransparentCard imageSrc='https://s.cn.bing.net/th?id=OHR.HautBarr_ZH-CN8274813404_1920x1080.webp&qlt=5' title='555' description='62516' /></div>)
      }
    </div>

  </div>)
}

const Index = () => {
  return (
    <div className="mt50 w-full">
      <Carousel autoplay>
        <div>
          <img
            src={bannerImg}
            alt="Image 1"
            className="h280 w-full rounded-20 object-cover"
          />
        </div>
        <div>
          <img
            src="https://s.cn.bing.net/th?id=OHR.HautBarr_ZH-CN8274813404_1920x1080.webp&qlt=5"
            alt="Image 1"
            className="h280 w-full object-cover"
          />
        </div>
      </Carousel>

      <div className='h63 w-full'></div>

      <CardsContainer />

    </div>
  )
}

export default Index
