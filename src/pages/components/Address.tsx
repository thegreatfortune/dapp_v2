// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Tooltip, message } from 'antd'

// import copyImg from '@/assets/images/loan-details/copy.svg'
import { CopyOutlined } from '@ant-design/icons'
import { maskAddress } from '@/utils/maskAddress'

interface IProps {
  address: string
}
const text = <span>Copy to Clipboard</span>

const Address: React.FC<IProps> = ({ address }) => {
  return (
    <CopyToClipboard text={address} onCopy={() => message.success('Copied')} >
      <Tooltip placement='top' title={text}>
        <div className='h-30 flex transform cursor-pointer items-center justify-around rounded-15 bg-#272c62 px-15 text-14 transition-transform hover:scale-105 focus:outline-none'>
          {maskAddress(address, 3)}
          <CopyOutlined className='ml-10 text-16' />
        </div>
      </Tooltip>
    </CopyToClipboard>
  )
}

export default Address
