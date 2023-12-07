import Avatar from 'antd/es/avatar'

// import logo from '@/assets/logo.png'

const Footer = () => {
  return (
        <div className='bottom-0 mt-59 flex justify-between'>
            <div className='flex justify-around'>
                <Avatar src="src/assets/images/market/2111.png" className="h-60 w-60"></Avatar>
                <div className="ml-33 mt-12 h-40 w-90 text-center text-40 font-400 lh-40 c-#fff">P2P</div>
            </div>
            <div className=''>
                <div className='m-auto mt-12 text-center lh-34 c-#fff'>
                    One stop P2P market, secure loans, and secure financial management.
                </div>
                <div className='mt-34 flex justify-center'>
                    <div className='w-89 flex justify-center'>
                        <img src="src/assets/images/market/TIcon.png" alt="1" className='transform transition-transform active:scale-95 hover:scale-105' />
                    </div>
                    <div className='w-89 flex justify-center'>
                        <img src="src/assets/images/market/IIcon.png" alt="2" className='transform transition-transform active:scale-95 hover:scale-105' />
                    </div>
                    <div className='w-89 flex justify-center'>
                        <img src="src/assets/images/market/FIcon.png" alt="3" className='transform transition-transform active:scale-95 hover:scale-105' />
                    </div>
                </div>
            </div>
            <div className='w-183'></div>
        </div>
  )
}

export default Footer
