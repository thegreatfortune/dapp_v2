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
    <img src="src/assets/images/personal-center/cardBackGround.png" alt="" />
  )
}

export default DetailCard
