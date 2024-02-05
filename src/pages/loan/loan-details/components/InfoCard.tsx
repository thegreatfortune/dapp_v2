import { Image } from 'antd'
import type { Models } from '@/.generated/api/models'
import { maskWeb3Address } from '@/utils/maskWeb3Address'
import { isContractAddress } from '@/utils/regex'
import cardPic from '@/assets/images/default.png'

interface CardProps {
  item: Models.LoanOrderVO
}

const InfoCard: React.FC<CardProps> = ({ item }) => {
  return (
    <div className="box-border h-419 w-321 flex flex-col border-2 border-#303241 rounded-8 border-solid bg-[#171822]">
      <div className='rounded-t-8 bg-[#F1F8FF]'>
        <Image width={317} src={item.picUrl}
          fallback={cardPic}
          preview={false}
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
                item.userInfo?.platformName ? `@${item.userInfo?.platformName}` : '@not bound'
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
