import React from 'react'
import { useTranslation } from 'react-i18next'

import { NavLink } from 'react-router-dom'
import Avatar from 'antd/es/avatar'
import Input from 'antd/es/input'
import CustomConnectButton from './CustomConnectButton'
import logo from '@/assets/react.svg'
import './navBar.css'

interface NavbarProps {
  title: string
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const { t } = useTranslation()

  return (
        <nav className="h120 w-full flex items-center theme-color text-white" id='navBar'>
            <div className="flex items-center text-center">
                <Avatar src={logo} className="mx5 h47 w47"></Avatar>
                <div className="text-30 font-900">{title}</div>
            </div>

            <div className='h-full w-60' />

            <ul className="flex list-none justify-around p0 font-size-20 text-[#D2D2D2]">
                <li className="inline-block scale-100 transform transition-transform hover:scale-110 hover:font-bold hover:text-white">
                    <NavLink to="/" target='_blank' className='text-[#D2D2D2]'>
                        {t('nav.home')}
                    </NavLink>
                </li>
                <li className="ml-44 inline-block scale-100 transform transition-transform hover:scale-110 hover:font-bold hover:text-white">
                    <NavLink to="/market" target='_blank' className='text-[#D2D2D2]'>
                        {t('nav.market')}
                    </NavLink>
                </li>
                <li className="ml-44 inline-block scale-100 transform transition-transform hover:scale-110 hover:font-bold hover:text-white">
                    <NavLink to="/trade" target='_blank' className='text-[#D2D2D2]'>
                        {t('nav.trade')}
                    </NavLink>
                </li>
            </ul>

            <div className='h-full w-337' />

            <Input
                placeholder="Basic usage"
                className="inline-block h-60 w-410 rounded-30 bg-#191d36 px-37 c-white placeholder-font-size-14 placeholder-c-[#D2D2D2]"
            />

            <div className='h-full w-44' />

            <CustomConnectButton />
        </nav>
  )
}

export default Navbar
