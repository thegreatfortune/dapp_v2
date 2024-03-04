import { Image } from 'antd'
import type { Models } from '@/.generated/api/models'
import { maskWeb3Address } from '@/utils/maskWeb3Address'
import { isContractAddress } from '@/utils/regex'
import tlogo from '@/assets/images/portalImages/tLogo.png'

interface CardProps {
  item: Models.ILoanOrderVO
}

const InfoCard: React.FC<CardProps> = ({ item }) => {
  return (
    <div className="relative box-border flex flex-col border-2 border-#303241 rounded-15 border-solid bg-[#171822]">
      <div className='absolute right-15 top-10 text-slate-500 font-semibold'>ID: {item.tradeId}</div>
      <div className='w-300 rounded-t-15 bg-[#F1F8FF]'>
        <Image
          // height={261}
          // width={261}
          src={tlogo}
          // src={item.picUrl}
          // fallback={cardPic}
          preview={false}
          className="rounded-t-15 object-cover"
        />
      </div>
      <div className='p-15'>
        {/* <div className='h11 w-full'></div> */}
        <div className='flex justify-between'>
          <ul className='m0 flex flex-col list-none gap-x-6 p0'>
            <li className='text-18'>
              {isContractAddress(item.userInfo?.address ?? '')
                ? maskWeb3Address(item.userInfo?.address ?? '')
                : (item.userInfo?.nickName ?? 'Not Bound')}
            </li>
            <li className='h29 text-16 c-#43465C'>

              {
                item.userInfo?.platformName
                  ? <a href={`https://twitter.com/${item.userInfo?.platformName}`}>@{item.userInfo?.platformName}</a>
                  : '@not bound'
              }
            </li>
            <li className='mt16'>
              <div>
                <span className='text-20 c-#999999'>Credit Score:</span>
                <span className='ml-10 text-22'>{item.userInfo?.creditScore ? (item.userInfo?.creditScore / 100).toLocaleString() : 0}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div >
  )
}

export default InfoCard
