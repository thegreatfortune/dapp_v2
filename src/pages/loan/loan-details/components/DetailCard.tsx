// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { CopyToClipboard } from 'react-copy-to-clipboard'

// import { Image, message } from 'antd'
// import { maskWeb3Address } from '@/utils/maskWeb3Address'

interface IProps {
  address: string
  porps: string

}

// eslint-disable-next-line no-empty-pattern
const DetailCard: React.FC<IProps> = ({ }) => {
  return (
    // <CopyToClipboard text={address} onCopy={() => message.success('Copied')} >
    //     <div className='h-23 w-104 flex transform cursor-pointer items-center justify-center rounded-15 bg-#272C62 text-10 c-#4959EE transition-transform hover:scale-105 focus:outline-none'>
    //         {address && maskWeb3Address(address)}
    //         <Image preview={false} className='px-6' src='src/assets/images/loan-details/copy.svg' />
    //     </div>
    // </CopyToClipboard>
    <div className='box-border h160 w321 b-1px b-#171822 b-#303241 b-rd-16 b-solid opacity-100'>
      <img src="src/assets/images/personal-center/cardBackGround.png" alt="" />
    </div>
  )
}

export default DetailCard
