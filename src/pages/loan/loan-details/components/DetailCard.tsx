// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { CopyToClipboard } from 'react-copy-to-clipboard'
import type { Models } from '@/.generated/api/models'

// import { Image, message } from 'antd'
// import { maskWeb3Address } from '@/utils/maskWeb3Address'

interface DetailProps {
  address: string
  props: string
  item: Models.LoanOrderVO

}

// const DetailCard: React.FC<DetailProps> = ({ item }) => {
//   return (

//     <div className='box-border h160 w321 b-1px b-#171822 b-#303241 b-rd-16 b-solid opacity-100'>
//       {/* <Image width={300} height={271} src={item.picUrl} className='b-rd-12'/> */}

//       <img src="src/assets/images/personal-center/cardBackGround.png" alt="" />
//     </div>
//   )
// }

const DetailCard = () => {
  return (
    <div>
      {/* style={{ backgroundImage: 'url(src/assets/images/loan-details/cardBackGround.png)' }} */}
      <div className='flex justify-between'>
            <div className='grid gap-40' >
              <div className='h160 w321 b-rd-16' style={{ backgroundImage: 'url(src/assets/images/loan-details/cardBackGround.png)' }}>
                <div className='grid gap-20'>
                  <div>12313</div>
                  <div>123213</div>
                </div>
              </div>
              <img src="src/assets/images/loan-details/cardBackGround.png" alt="" className='h160 w321 opacity-100' />
              <img src="src/assets/images/loan-details/cardBackGround.png" alt="" className='h160 w321 opacity-100' />
            </div>
            <div className='grid ml-50 gap-40'>
              <img src="src/assets/images/loan-details/cardBackGround.png" alt="" className='h160 w321 opacity-100' />
              <img src="src/assets/images/loan-details/cardBackGround.png" alt="" className='h160 w321 opacity-100' />
              <img src="src/assets/images/loan-details/cardBackGround.png" alt="" className='h160 w321 opacity-100' />
            </div>
          </div>
    </div>
  )
}

export default DetailCard
