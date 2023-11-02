import React from 'react'
import { Avatar, Input } from 'antd'
import CustomConnectButton from './CustomConnectButton'
import UserDropdown from './UserDropdown'
import logo from '@/assets/react.svg'

interface NavbarProps {
  title: string
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  return (
        <nav className="mt-44 h100 flex items-center justify-around theme-color text-white">
            <div className="flex items-center text-center">
                <Avatar src={logo} className='mx5 h60 w60'></Avatar>
                <div className="text-40">{title}</div>
            </div>

            <ul className="min-w-420 flex list-none justify-around font-size-20 text-[#D2D2D2]">
                <li className="inline-block scale-100 transform transition-transform hover:scale-110 hover:font-bold hover:text-white">
                    Home
                </li>
                <li className="inline-block scale-100 transform transition-transform hover:scale-110 hover:font-bold hover:text-white">
                    Marketplace
                </li>
                <li className="inline-block scale-100 transform transition-transform hover:scale-110 hover:font-bold hover:text-white">
                    Transaction
                </li>
            </ul>

            <Input
                placeholder="Basic usage"
                className="inline-block h-60 w-580 border-white bg-transparent px-37 c-white placeholder-font-size-14 placeholder-c-[#D2D2D2]"
            />

            <div className="flex items-center text-18 space-x-16">
                <CustomConnectButton />
                <UserDropdown />
            </div>
        </nav>
  )
}

export default Navbar
