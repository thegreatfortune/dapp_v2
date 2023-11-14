import Avatar from 'antd/es/avatar'
import logo from '@/assets/logo.png'

const Footer = () => {
  return (<div>
        <div className="float-left flex items-center text-center">
            <Avatar src={logo} className="mx5 h47 w47"></Avatar>
            <div className="text-30 font-900">1561</div>
        </div>

        <div className='mt41 text-center'>
            One stop P2P market, secure loans, and secure financial management.
        </div>
    </div>)
}

export default Footer
