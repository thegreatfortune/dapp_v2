import Avatar from 'antd/es/avatar'
import logo from '@/assets/logo.png'

const Footer = () => {
  return (<div>
        <div className="float-left flex items-center text-center">
            <Avatar src={logo} className="mx5 h47 w47"></Avatar>
            <div className="ml-33 text-30 font-900">P2P</div>
        </div>

        <div className='m-auto mr-150 mt41 text-center lh-34'>
            One stop P2P market, secure loans, and secure financial management.
        </div>
        <div className='h-30 w-full'></div>
        <div className='flex justify-center'>
            <div className='w-89'>
                <img src="src/assets/images/TIcon.png" alt="1" className='transform transition-transform active:scale-95 hover:scale-105' />
            </div>
            <div className='w-89'>
                <img src="src/assets/images/IIcon.png" alt="2" className='transform transition-transform active:scale-95 hover:scale-105' />
            </div>
            <div className='w-89'>
                <img src="src/assets/images/FIcon.png" alt="3" className='transform transition-transform active:scale-95 hover:scale-105' />
            </div>
        </div>
    </div>)
}

export default Footer
