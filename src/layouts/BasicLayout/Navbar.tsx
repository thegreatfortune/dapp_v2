import React from 'react'
import { Avatar, Input } from 'antd'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import CustomConnectButton from './CustomConnectButton'
import UserDropdown from './UserDropdown'
import logo from '@/assets/react.svg'

interface NavbarProps {
  title: string
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  return (
        <nav className="h100 mt-44 theme-color text-white flex justify-around items-center">
            <div className="text-center flex items-center">
                <Avatar src={logo} className='w60 h60 mx5'></Avatar>
                <div className="text-40">{title}</div>
            </div>

            <ul className="min-w-420 flex justify-around list-none text-[#D2D2D2] font-size-20">
                <li className="hover:text-white hover:font-bold inline-block transform transition-transform scale-100 hover:scale-110">
                    Home
                </li>
                <li className="hover:text-white hover:font-bold inline-block transform transition-transform scale-100 hover:scale-110">
                    Marketplace
                </li>
                <li className="hover:text-white hover:font-bold inline-block transform transition-transform scale-100 hover:scale-110">
                    Transaction
                </li>
            </ul>

            <Input
                placeholder="Basic usage"
                className="w-580 h-60 px-37 inline-block c-white border-white bg-transparent placeholder-c-[#D2D2D2]  placeholder-font-size-14"
            />

            <div className="flex items-center text-18 space-x-16">
                <CustomConnectButton />
                <UserDropdown />
            </div>
        </nav>
  )
}

export default Navbar
