import Avatar from 'antd/es/avatar'
import Button from 'antd/es/button'
import BigNumber, { } from 'bignumber.js'
import { Image, Tooltip } from 'antd'
import type { Models } from '@/.generated/api/models'
import infoIconIcon from '@/assets/images/apply-loan/InfoIcon.png'
import { isContractAddress } from '@/utils/regex'
import { maskWeb3Address } from '@/utils/maskWeb3Address'
import logo from '@/assets/images/portalImages/logo.png'
import cardPic from '@/assets/images/default.png'

interface CardProps {
  item: Models.LoanOrderVO
  children?: React.ReactNode
  btnText?: string
  copies?: number
}

interface CustomAvatarProps {
  src: string
  name: string
  twitter: string
}

const CustomAvatar: React.FC<CustomAvatarProps> = ({ src, name, twitter }) => {
  return (
    <div className="flex items-center">
      <Avatar src={src} className='h40 w40 bg-slate-200' />
      {
        name && twitter
          ? <div className="ml-4">
            <h2 className="m0 p0 text-14 font-semibold">{isContractAddress(name ?? '') ? maskWeb3Address(name) : name}</h2>
            <span className="text-12 text-gray-500">@{twitter}</span>
          </div>
          : 'Not bound'
      }

    </div>
  )
}

const TransparentCard: React.FC<CardProps> = ({ item, children, btnText, copies }) => {
  return (
    <div className="card box-border h-440 w-315 flex flex-col cursor-pointer border-2 border-#303241 rounded-16 border-solid bg-[#171822] p-24">
      {/* <img
        src={item?.picUrl}
        alt={item.loanName}
        className="h-232 w-266 rounded-16 object-cover"
        onError={({ currentTarget }) => {
          currentTarget.onerror = null
          currentTarget.src = cardPic
        }}
      /> */}
      <Image
        preview={false}
        src={item?.picUrl}
        alt={item.loanName}
        className="rounded-16 object-cover"
        width={266}
        height={232}
        // onError={({ currentTarget }) => {
        //   currentTarget.onerror = null
        //   currentTarget.src = cardPic
        // }}
        placeholder={
          <Image
            src={cardPic}
            width={266}
            height={232}
          />
        }
        fallback={cardPic}
      />
      <div className='text-left'>
        <div className='h10 w-full'></div>
        <h2 className="m0 h35 truncate p0 text-22 font-semibold c-#37A4F8">{item.loanName}</h2>
        <div className='h8 w-full'></div>

        <div className='flex justify-between'>
          <ul className='m0 flex flex-col list-none gap-8 p0'>
            <li className='h18 flex flex-col text-14 c-#999999'>
              Loan Amount
            </li>
            <li className='h29 text-18 c-#FFFFFF'>
              $ {Number.parseFloat(BigNumber(item.loanMoney ?? 0).div(BigNumber(10 ** 18)).toFixed(2)).toLocaleString()}
            </li>
            <li>
              {children ?? <CustomAvatar
                src={item.userInfo?.pictureUrl ? item.userInfo?.pictureUrl : logo}
                name={item.userInfo?.nickName ?? 'not bound'}
                twitter={item.userInfo?.platformName ?? 'not bound'} />}
            </li>
          </ul>

          <ul className='m0 flex flex-col list-none gap-8 p0'>
            <li className='h18 flex flex-col text-14 c-#999999'>
              {copies ? `Share ${copies}` : 'Risk Level'}

            </li>
            <li className='h29 flex text-16 c-#FFFFFF' style={{ color: item.tradingForm !== 'SpotGoods' ? 'red' : '#FFFFFF' }}>
              {item.tradingForm === 'SpotGoods' ? 'Low' : 'High'}
              <Tooltip color='#303241' overlayInnerStyle={{ padding: 25, width: 349 }}
                title={
                  <div>
                    1. Low-risk loan funds can only be designated for spot transactions,
                    and spot transactions can be liquidated to obtain repayment funds;
                    <br />
                    <br />
                    2. High-risk loan funds can be used to trade contracts,
                    which involves the risk of liquidation; loan funds can also be withdrawn,
                    requiring the borrower to actively recharge for repayment.
                  </div>
                }
              >
                <Image className='ml-5 cursor-help' width={14} height={14} src={infoIconIcon} preview={false} />
              </Tooltip>
            </li>
            <li>
              {
                // btnText
                //   ? <Button className='mt-10 h30 w-110 text-14 primary-btn'>{btnText}</Button>
                //   :
                <Button className='mt-10 h30 w-110 text-14 primary-btn'>{btnText ?? 'Follow'}</Button>
              }

              {/* <Button className='mt-10 h30 w-110 text-12 primary-btn'>{btnText ?? 'Follow'}</Button> */}
            </li>
          </ul>

        </div>
      </div>
    </div>
  )
}

export default TransparentCard
