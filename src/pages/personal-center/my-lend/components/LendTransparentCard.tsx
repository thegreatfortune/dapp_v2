import Avatar from 'antd/es/avatar'
import Button from 'antd/es/button'
import { useNavigate } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import type { Models } from '@/.generated/api/models'

interface CardProps {
  item: Models.SimpleLoanVo
  children?: React.ReactNode
  copies?: number
}

interface CustomAvatarProps {
  src: string
  name: string
  twitter: string
}

const LendTransparentCard: React.FC<CardProps> = ({ item, children, copies }) => {
  const navigate = useNavigate()

  return (
      <div className="box-border h-429 w-315 flex flex-col cursor-pointer border-2 border-#303241 rounded-16 border-solid bg-[#171822] p-24">
        <img
          src={item?.picUrl}
          alt={item.loanName}
          className="h-232 w-266 rounded-16 object-cover"
        />
        <div className='text-left'>
          <div className='h11 w-full'></div>
          <h2 className="m0 h35 p0 text-24 font-semibold c-#37A4F8">{item.loanName}</h2>

          <div className='flex justify-between'>
            <ul className='m0 flex flex-col list-none gap-8 p0'>
              <li className='h18 flex flex-col text-14 c-#999999'>
                Apply for loan
              </li>
              <li className='h29 text-16 c-#FFFFFF'>
                {ethers.formatUnits(item.loanMoney ?? 0)} USDT
              </li>
              <li>
              <Button className='h30 w-110 primary-btn' >Shell</Button>
              </li>
            </ul>

            <ul className='m0 flex flex-col list-none gap-8 p0'>
              <li className='h18 flex flex-col text-14 c-#999999'>
                { copies ? `Share ${copies}` : 'Risk level'}

              </li>
              <li className='h29 text-16 c-#FFFFFF' style={ { color: item.tradingForm !== 'SpotGoods' ? 'red' : '#FFFFFF' }}>
                {item.tradingForm === 'SpotGoods' ? 'Low' : 'Hight' }
              </li>
              <li>
              <Button className='h30 w-110 primary-btn' >Extract</Button>
              </li>
            </ul>

          </div>
        </div>
      </div>
  )
}

export default LendTransparentCard