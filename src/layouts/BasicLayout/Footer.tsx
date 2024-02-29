import Avatar from 'antd/es/avatar'
import { useTranslation } from 'react-i18next'

// import logo from '@/assets/logo.png'

const Footer = () => {
  const { t } = useTranslation()

  return (
        // <div className='bottom-0% left-0 right-0 m-auto mt-a h-full min-h-full'>
        <div className='bottom-0% left-0 right-0'>
            <div className='bottom-0 mb-48 mt-59 flex justify-between'>
                <div className='flex justify-around'>
                    <Avatar src="/src/assets/images/market/logo.png" className="h-60 w-60"></Avatar>
                    <div className="ml-33 mt-12 h-40 w-90 text-center text-40 c-#fff font-400 lh-40">{`${t('Footer.div.title.footerLogo')}`}</div>
                </div>
                <div>
                    <div className='m-auto mt-12 text-center c-#fff lh-34'>
                        {`${t('Footer.div.title.footerProfile')}`}
                    </div>
                    <div className='mt-34 flex justify-center'>
                        <div className='w-89 flex justify-center'>
                            <img src="/src/assets/images/market/TIcon.png" alt="1" className='transform transition-transform active:scale-95 hover:scale-105' />
                        </div>
                        <div className='w-89 flex justify-center'>
                            <img src="/src/assets/images/market/IIcon.png" alt="2" className='transform transition-transform active:scale-95 hover:scale-105' />
                        </div>
                        <div className='w-89 flex justify-center'>
                            <img src="/src/assets/images/market/FIcon.png" alt="3" className='transform transition-transform active:scale-95 hover:scale-105' />
                        </div>
                    </div>
                </div>
                <div className='w-183'></div>
            </div>
        </div>
  )
}

export default Footer
