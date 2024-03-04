import { ethers } from 'ethers'
import { Image } from 'antd'
import { Models } from '@/.generated/api/models'
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
    <div className="card relative box-border w-300 flex flex-col cursor-pointer border-2 border-#303241 rounded-15 border-solid">
      <div className="absolute right-15 top-10 text-slate-500 font-semibold">ID: {item.marketBalance?.tokenId}</div>
      <div className='rounded-t-15 bg-[#F1F8FF]'>
        <Image
          // src={item?.loan?.picUrl}
          preview={false}
          src={tlogo}
          // alt={item.loan?.loanName}
          className="rounded-b-15 object-cover"
        />
      </div>
      <div className='px-25 pb-20 pt-15 text-left'>
        <div className='h11 w-full'></div>
        <h2 className="m0 h35 truncate p0 text-22 c-#37A4F8 font-semibold">{item.loan?.loanName}</h2>

        <div className='flex justify-between'>
          <ul className='mt-6 flex flex-col list-none gap-8 p0'>
            <li className='h18 flex flex-col text-14 c-#999999'>
              Apply for a loan
            </li>
            <li className='h29 text-16 c-#FFFFFF'>
              $ {toCurrencyString(Number(ethers.formatUnits(item.loan?.loanMoney ?? 0)))}
            </li>
            {/* <li>
              <Button className='mt-4 h30 w-110 text-14 primary-btn' >Sell</Button>
            </li> */}
          </ul>

          <ul className='mt-6 flex flex-col list-none gap-8 p0'>
            <li className='h18 flex flex-col text-14 c-#999999'>
              {copies ? `Share ${copies}` : 'Risk level'}
            </li>
            <li className='h29 text-16 c-#FFFFFF' style={{ color: item.loan?.tradingForm !== Models.SpecifiedTradingTypeEnum.Spot ? 'red' : '#FFFFFF' }}>
              {item.loan?.tradingForm === Models.SpecifiedTradingTypeEnum.Spot ? 'Low' : 'Hight'}
            </li>
            {/* <li>
              <Button className='mt-4 h30 w-110 text-14 primary-btn' >Extract</Button>
            </li> */}
          </ul>

        </div>
      </div>
    </div>
  )
}

export default LendTransparentCard
