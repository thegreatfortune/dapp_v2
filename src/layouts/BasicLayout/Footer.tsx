import Avatar from 'antd/es/avatar'
import logo from '@/assets/logo.png'

const Footer = () => {
  return (<div>
        <div className="float-left flex items-center text-center">
            <Avatar src="src/assets/images/2111.png" className="mx5 h47 w47"></Avatar>
            <div className="m-auto ml-23 h-40 w-90 text-left text-37 lh-49 c-#fff">P2P</div>
        </div>

        <div className='m-auto mr-160 mt41 text-center lh-34'>
            One stop P2P market, secure loans, and secure financial management.
        </div>
        <div className='h-30 w-full'></div>
        <div className='flex justify-center'>
            <div className='w-89 flex justify-center'>
                <img src="src/assets/images/TIcon.png" alt="1" className='transform transition-transform active:scale-95 hover:scale-105' />
            </div>
            <div className='w-89 flex justify-center'>
                <img src="src/assets/images/IIcon.png" alt="2" className='transform transition-transform active:scale-95 hover:scale-105' />
            </div>
            <div className='w-89 flex justify-center'>
                <img src="src/assets/images/FIcon.png" alt="3" className='transform transition-transform active:scale-95 hover:scale-105' />
            </div>
        </div>
    </div>)
}

export default Footer
