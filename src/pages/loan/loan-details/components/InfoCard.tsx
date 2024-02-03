import { Image } from 'antd'
import type { Models } from '@/.generated/api/models'
import { maskWeb3Address } from '@/utils/maskWeb3Address'
import { isContractAddress } from '@/utils/regex'

interface CardProps {
  item: Models.LoanOrderVO
}

const InfoCard: React.FC<CardProps> = ({ item }) => {
  return (
    <div className="box-border h-419 w-321 flex flex-col border-2 border-#303241 rounded-16 border-solid bg-[#171822] p-10">
      <Image width={300} height={271} src={item.picUrl} className='b-rd-12' />

      <div className='text-left'>
        <div className='h11 w-full'></div>
        <div className='flex justify-between'>
          <ul className='m0 flex flex-col list-none gap-x-6 p0'>
            <li className='text-21'>
              {isContractAddress(item.userInfo?.address ?? '') ? maskWeb3Address(item.userInfo?.address ?? '') : (item.userInfo?.nickName ?? 'not bound')}
            </li>
            <li className='h29 text-16 c-#43465C'>
              {
                item.userInfo?.platformName ? `@${item.userInfo?.platformName}` : '@not bound'
              }
            </li>
            <li className='mt16'>
              <div>
                <span className='text-20 c-#999999'>Credit score:</span>
                <span className='ml-10 text-24'>{item.userInfo?.creditScore ? (item.userInfo?.creditScore / 100).toLocaleString() : 0}</span>
              </div>
            </li>
          </ul>

        </div>
      </div>
    </div>
  )
}

export default InfoCard
