import React from 'react'
import { NavLink } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

// import Navbar from './Navbar'
// import Footer from './Footer'

import navCoinImage from '../assets/images/portalImages/navCoin.png'
import fIconImage from '../assets/images/portalImages/FIcon.png'
import iIconImage from '../assets/images/portalImages/IIcon.png'
import tIconImage from '../assets/images/portalImages/TIcon.png'

interface IProps {
  children: React.ReactNode
}

const PortalLayout: React.FC<IProps> = (props) => {
  const { t } = useTranslation()

  //   const navigate = useNavigate()

  return (
        <div className='flex flex-col items-center bg-cover' style={{ backgroundImage: 'url(/static/backGround1.png),url(/static/backGround2.png)' }} >
            <header className='w-1400'>
                {/* <Navbar title={t('nav.title')} />u */}
                <div className='h-40 w-full'></div>
                <div className='flex justify-between'>
                    <div className='flex justify-between'>
                        <img src={ navCoinImage } alt="" className='mt-14 h-34 w-34' />
                        <div className='m-auto ml-12 w-115 text-center text-22 font-normal lh-52 font-mono c-#fff'>{`${t('portal.layout.title')}`}</div>
                    </div>
                    <div className='flex justify-between'>
                        <NavLink to="/portal"><div className='m-auto mt-4 h-52 w-115 w-87 transform b-rd-0 text-center text-21 font-400 font-normal lh-52 font-mono c-#CECECE transition-transform active:scale-95 hover:scale-105 hover:c-#fff'>{`${t('portal.layout.menu1')}`}</div></NavLink>
                        <NavLink to="/market"><div className='m-auto mt-4 h-52 w-115 w-87 transform b-rd-0 text-center text-21 font-400 font-normal lh-52 font-mono c-#CECECE transition-transform active:scale-95 hover:scale-105 hover:c-#fff'>{`${t('portal.layout.menu2')}`}</div></NavLink>
                        <NavLink to="/trade"><div className='m-auto mt-4 h-52 w-115 w-87 transform b-rd-0 text-center text-21 font-400 font-normal lh-52 font-mono c-#CECECE transition-transform active:scale-95 hover:scale-105 hover:c-#fff'>{`${t('portal.layout.menu3')}`}</div></NavLink>
                    </div>

                </div>
            </header>
            <main className='w-1400 items-center'>
                {props.children}
            </main>

            <div className='h70' />

            <hr className='h3 w-full border-none bg-#303241' />

            <footer className='h198 w-1400'>
                {/* <Footer /> */}
                <div className='flex justify-between'>
                    <div className='flex justify-between'>
                        <img src={ navCoinImage } alt="" className='mt-10 h-34 w-34' />
                        <div className='m-auto mb-75 ml-12 mt-12 w-115 text-center text-22 font-normal font-mono c-#fff'>{`${t('portal.layout.title')}`}</div>
                    </div>
                    <div className=''>
                        <div className='m-auto mt-10 h-65 w-630 text-center text-18 font-400 lh-35 c-#fff'>{`${t('portal.layout.illustrate')}`}</div>
                        <div className='flex justify-center'>
                            <div className='w-89'>
                                <img src={ tIconImage } alt="" className='transform transition-transform active:scale-95 hover:scale-105'/>
                            </div>
                            <div className='w-89'>
                                <img src={ iIconImage } alt="" className='transform transition-transform active:scale-95 hover:scale-105'/>
                            </div>
                            <div className='w-89'>
                                <img src={ fIconImage } alt="" className='transform transition-transform active:scale-95 hover:scale-105'/>
                            </div>
                        </div>
                    </div>
                    <div className='w115'></div>

                </div>
            </footer>
        </div>
  )
}

export default PortalLayout
