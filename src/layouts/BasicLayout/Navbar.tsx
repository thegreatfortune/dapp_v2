import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { NavLink } from 'react-router-dom'
import Avatar from 'antd/es/avatar'
import Image from 'antd/es/image'
import { AutoComplete } from 'antd'
import CustomConnectButton from './CustomConnectButton'
import logo from '@/assets/react.svg'
import searchImg from '@/assets/images/search.png'
import './navBar.css'
import useNavbarQueryStore from '@/store/useNavbarQueryStore'

interface NavbarProps {
  title: string
  showInput?: boolean
}

const Navbar: React.FC<NavbarProps> = ({ title, showInput }) => {
  const { t } = useTranslation()

  const { updateQuery } = useNavbarQueryStore()

  const [options, setOptions] = useState<{ value: string }[]>([])

  const getPanelValue = (searchText: string) => {
    return [{ value: searchText }]
  }

  const onSelect = (data: string) => {
    updateQuery(data)

    console.log('onSelect', data)
  }

  return (
        <nav className="h140 w-full flex items-center text-white" id='navBar'>
            <div className="flex items-center text-center">
                <Avatar src={logo} className="mx6 h47 w47"></Avatar>
                <div className="text-30 font-900"><i>{title}</i></div>
            </div>

            <div className='h-full w-176' />

            <ul className="flex list-none justify-around p0 font-size-20 text-[#D2D2D2]">
                <li className="inline-block scale-100 transform transition-transform hover:scale-110 hover:font-bold hover:text-white">
                    <NavLink to="/" target='_blank' className='text-[#D2D2D2]'>
                        {t('nav.home')}
                    </NavLink>
                </li>
                <li className="ml-30 inline-block scale-100 transform transition-transform hover:scale-110 hover:font-bold hover:text-white">
                    <NavLink to="/market" target='_blank' className='text-[#D2D2D2]'>
                        {t('nav.market')}
                    </NavLink>
                </li>
                <li className="ml-30 inline-block scale-100 transform transition-transform hover:scale-110 hover:font-bold hover:text-white">
                    <NavLink to="/trade" target='_blank' className='text-[#D2D2D2]'>
                        {t('nav.trade')}
                    </NavLink>
                </li>
            </ul>

            <div className='h-full w-178' />
            {/* className="h-60 w-410 rounded-30 bg-transparent px-37 c-white placeholder-font-size-14 placeholder-c-[#D2D2D2]" */}

            {
                showInput
                && <div className='relative box-border h48 w310'>

                    <AutoComplete
                        popupClassName="certain-category-search-dropdown"
                        popupMatchSelectWidth={500}
                        options={options}
                        onSelect={onSelect}
                        onSearch={text => setOptions(getPanelValue(text))}
                        className="h48 w310"
                    >
                        <input className="h48 w310 border-1 border-white rounded-24 border-solid bg-#040508 p-x-30 p-y13 c-white placeholder-c-#D2D2D2" placeholder="Search item,collector,and more" type="text" />
                    </AutoComplete>
                    <Image width={16} height={16} preview={false} className='absolute right--266 top--34 z-1' src={searchImg} />

                </div>
            }

            {/*
            <Input
                placeholder="Search Twitter account, document name, contract address"
                className="h-60 rounded-30 px-37 c-white placeholder-font-size-14 placeholder-c-[#D2D2D2]"
                suffix={
                    <Image preview={false} src={searchImg} alt="Search" className='cursor-pointer' />
                }
            /> */}

            <div className='h-full w-178' />

            <CustomConnectButton />
        </nav>
  )
}

export default Navbar
