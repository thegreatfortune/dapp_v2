import Button from 'antd/es/button'
import { ethers } from 'ethers'
import type { Models } from '@/.generated/api/models'
import toCurrencyString from '@/utils/convertToCurrencyString'
import tlogo from '@/assets/images/portalImages/tLogo.png'

interface CardProps {
  item: Models.MyFollowVo
  children?: React.ReactNode
  copies?: number
}

interface CustomAvatarProps {
  src: string
  name: string
  twitter: string
}

const LendTransparentCard: React.FC<CardProps> = ({ item, copies }) => {
  return (
    <div className="box-border flex flex-col cursor-pointer border-2 border-#303241 rounded-16 border-solid bg-[#171822] p-24">
      <div className='relative'>
        <div className="absolute w-300 flex justify-between p-l-18 c-black">
          <span># {item.marketBalance?.tokenId}</span>
          <span>X {item.marketBalance?.amount}</span>
        </div>
        <img
          // src={item?.loan?.picUrl}
          src={tlogo}
          alt={item.loan?.loanName}
          className="rounded-b-15 object-cover"
        />
      </div>
      <div className='text-left'>
        <div className='h11 w-full'></div>
        <h2 className="m0 h35 p0 text-22 c-#37A4F8 font-semibold">{item.loan?.loanName}</h2>

        <div className='flex justify-between'>
          <ul className='mt-6 flex flex-col list-none gap-8 p0'>
            <li className='h18 flex flex-col text-14 c-#999999'>
              Apply for a loan
            </li>
            <li className='h29 text-16 c-#FFFFFF'>
              $ {toCurrencyString(Number(ethers.formatUnits(item.loan?.loanMoney ?? 0)))}
            </li>
            <li>
              <Button className='mt-4 h30 w-110 text-14 primary-btn' >Sell</Button>
            </li>
          </ul>

          <ul className='mt-6 flex flex-col list-none gap-8 p0'>
            <li className='h18 flex flex-col text-14 c-#999999'>
              {copies ? `Share ${copies}` : 'Risk level'}
            </li>
            <li className='h29 text-16 c-#FFFFFF' style={{ color: item.loan?.tradingForm !== 'SpotGoods' ? 'red' : '#FFFFFF' }}>
              {item.loan?.tradingForm === 'SpotGoods' ? 'Low' : 'Hight'}
            </li>
            <li>
              <Button className='mt-4 h30 w-110 text-14 primary-btn' >Extract</Button>
            </li>
          </ul>

        </div>
      </div>
    </div>
  )
}

export default LendTransparentCard
