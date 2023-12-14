// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Image, Tooltip, message } from 'antd'

import { maskWeb3Address } from '@/utils/maskWeb3Address'

interface IProps {
  address: string

}
const text = <span>Copy to Clipboard</span>

const Address: React.FC<IProps> = ({ address }) => {
  return (
        <CopyToClipboard text={address} onCopy={() => message.success('Copied')} >
         <Tooltip placement='top' title={text}>
         <div className='h-23 w-104 flex transform cursor-pointer items-center justify-center rounded-15 bg-#272c62 text-10 c-#4959EE transition-transform hover:scale-105 focus:outline-none'>
                {address && maskWeb3Address(address)}
                <Image preview={false} className='px-6' src='src/assets/images/loan-details/copy.svg' />
            </div>
         </Tooltip>
        </CopyToClipboard>
  )
}

export default Address
