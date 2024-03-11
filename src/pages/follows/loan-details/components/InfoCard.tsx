import { Image } from 'antd'
import type { Models } from '@/.generated/api/models'
import { maskAddress } from '@/utils/maskAddress'
import { isContractAddress } from '@/utils/regex'
import tlogo from '@/assets/images/portalImages/tLogo.png'

interface CardProps {
  loanDetail: Models.ILoanOrderVO
}

const InfoCard: React.FC<CardProps> = ({ loanDetail }) => {
  return (
    <div className="relative box-border flex flex-col border-2 border-#303241 rounded-15 border-solid bg-[#171822]">
      <div className='absolute right-15 top-10 text-slate-500 font-semibold'>ID: {loanDetail.tradeId}</div>
      <div className='w-300 rounded-t-15 bg-[#F1F8FF]'>
        <Image
          src={tlogo}
          preview={false}
          className="rounded-t-15 object-cover"
        />
      </div>
      <div className='p-15'>
        {/* <div className='h11 w-full'></div> */}
        <div className='flex justify-between'>
          <ul className='m0 flex flex-col list-none gap-x-6 p0'>
            <li className='h29 text-18 c-#43465C'>
              {
                loanDetail.userInfo?.platformName
                  ? <a href={`https://twitter.com/${loanDetail.userInfo?.platformName}`}>@{loanDetail.userInfo?.platformName}</a>
                  : '@not bound'
              }
            </li>
            <li className='text-16'>
              {isContractAddress(loanDetail.userInfo?.address ?? '')
                ? maskAddress(loanDetail.userInfo?.address ?? '', 4)
                : (loanDetail.userInfo?.nickName ?? 'Not Bound')}
            </li>
            <li className='mt16'>
              <div>
                <span className='text-18 c-#999999'>Credit Score:</span>
                <span className='ml-10 text-18'>{loanDetail.userInfo?.creditScore ? (loanDetail.userInfo?.creditScore / 100).toLocaleString() : 0}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div >
  )
}

export default InfoCard
