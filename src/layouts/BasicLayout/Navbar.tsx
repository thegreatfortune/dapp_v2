import React from 'react'
import { Avatar, Input } from 'antd'
import { useTranslation } from 'react-i18next'

import { NavLink } from 'react-router-dom' // 使用 NavLink 替代 Link
import CustomConnectButton from './CustomConnectButton'
import logo from '@/assets/react.svg'
import './navBar.css'

interface NavbarProps {
  title: string
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const { t } = useTranslation()

  return (
        <nav className="mt-44 h100 flex items-center justify-around theme-color text-white" id='navBar'>
            <div className="flex items-center text-center">
                <Avatar src={logo} className="mx5 h60 w60"></Avatar>
                <div className="text-40">{title}</div>
            </div>

            <ul className="min-w-420 flex list-none justify-around font-size-20 text-[#D2D2D2]">
                <li className="inline-block scale-100 transform transition-transform hover:scale-110 hover:font-bold hover:text-white">
                    <NavLink to="/" target='_blank' className='text-[#D2D2D2]'>
                        {t('nav.home')}
                    </NavLink>
                </li>
                <li className="inline-block scale-100 transform transition-transform hover:scale-110 hover:font-bold hover:text-white">
                    <NavLink to="/market" target='_blank' className='text-[#D2D2D2]'>
                        {t('nav.market')}
                    </NavLink>
                </li>
                <li className="inline-block scale-100 transform transition-transform hover:scale-110 hover:font-bold hover:text-white">
                    <NavLink to="/trade" target='_blank' className='text-[#D2D2D2]'>
                        {t('nav.trade')}
                    </NavLink>
                </li>
            </ul>

            <Input
                placeholder="Basic usage"
                className="inline-block h-60 w-580 border-white bg-transparent px-37 c-white placeholder-font-size-14 placeholder-c-[#D2D2D2]"
            />

            <CustomConnectButton />
        </nav>
  )
}

export default Navbar
