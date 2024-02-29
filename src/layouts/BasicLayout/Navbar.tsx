import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router-dom'
import Image from 'antd/es/image'
import type { MenuProps } from 'antd'
import { AutoComplete, Dropdown } from 'antd'
import BigNumber from 'bignumber.js'
import CustomConnectButton from './CustomConnectButton'
import logo from '@/assets/images/LOGO.svg'
import searchImg from '@/assets/images/search.png'
import { Models } from '@/.generated/api/models'
import { LoanService } from '@/.generated/api/Loan'
import { isContractAddress, isTwitterHandle } from '@/utils/regex'
import menuImage from '@/assets/images/menu.png'

interface NavbarProps {
  title: string
  showInput?: boolean
}

// hidden search bar after user searched
const Navbar: React.FC<NavbarProps> = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [options, setOptions] = useState<{ value: string }[]>([])

  const handleSearch = async (value: string) => {
    const res = await fetchData(value)
    const data = res.records?.map(e => ({
      value: e.tradeId ? String(e.tradeId) : value,
      label: (<div className='flex justify-between'> <span>{e.loanName}</span> <span className='c-blue'>${BigNumber(e.loanMoney ?? 0).div(BigNumber(10).pow(18)).toString()}</span></div>),
    })) ?? []

    setOptions(value ? data : [])
  }

  async function fetchData(searchText: string) {
    const params = { ...new Models.ApiLoanPageLoanContractGETParams(), borrowUserId: undefined }
    params.limit = 12

    if (isContractAddress(searchText ?? ''))
      params.capitalPoolContract = searchText
    else if (isTwitterHandle(searchText ?? ''))
      params.bindPlatform = searchText && (params.platformType = 'Twitter')
    else
      params.loanName = searchText

    return LoanService.ApiLoanPageLoanContract_GET(params)
  }

  function onSelect(value: string) {
    navigate(`/loan-details?prePage=market&tradeId=${value}`)
  }

  const items: MenuProps['items'] = [
    {
      key: t('nav.home'),
      label: (
        <NavLink
          to="/"
          target="_self"
          className="nav-bar-dropdown-item">
          Home
        </NavLink>
      ),
    },
    {
      key: t('nav.follow'),
      label: (
        <NavLink
          to="/follows"
          target="_self"
          // className={`text-white hover:c-#5ec1d0 ${['/market', '/market-token'].includes(location.pathname) && 'c-#5ec1d0'}`}>
          className="nav-bar-dropdown-item">
          Follows
        </NavLink>
      ),
    },
    {
      key: t('nav.market'),
      label: (
        <NavLink
          to="/market"
          target="_self"
          // className={`text-white  hover:c-#5ec1d0 ${['/tokens', '/my-glyph', '/token-detail'].includes(location.pathname) && 'c-#5ec1d0'}`}>
          className="nav-bar-dropdown-item">
          Share Market
        </NavLink>
      ),
    },
    {
      key: t('nav.glyph'),
      label: (
        <NavLink
          to="https://glyph.followfi.io"
          target="_blank"
          // className={`text-white  hover:c-#5ec1d0 ${['/tokens', '/my-glyph', '/token-detail'].includes(location.pathname) && 'c-#5ec1d0'}`}>
          className="nav-bar-dropdown-item">
          Glyph
        </NavLink>
      ),
    },
  ]

  return (
    <nav className="h100 w-full flex items-center justify-between text-white" id='navBar'>
      <div className="nav-logo">
        <Image src={logo} preview={false}></Image>
      </div>

      <div className='flex items-center justify-end'>
        <div className='box-border hidden h48 flex items-center justify-center'>
          <Image width={16} height={16} preview={false} className='relative right--195 top--3 z-1 hidden' src={searchImg} />
          <AutoComplete
            popupClassName="certain-category-search-dropdown"
            options={options}
            onSearch={handleSearch}
            onSelect={onSelect}
            className="hidden h40 w200"
          >
            <input className="h40 w310 border-1 border-white rounded-24 border-solid bg-#040508 p-y13 pl-20 pr-25 c-white placeholder-c-#D2D2D2" placeholder={t('basicLayout.navBar.placeholder')} type="text" />
          </AutoComplete>
        </div>

        <ul className="nav-bar">
          <li className="nav-bar-item">
            <NavLink to="/" target='_blank' className='c-white hover:c-#5ec1d0'>
              {t('nav.home')}
            </NavLink>
          </li>
          <li className="nav-bar-item">
            <NavLink to="/follows" target='_self' className='c-white hover:c-#5ec1d0' >
              {t('nav.follow')}
            </NavLink>
          </li>
          <li className="nav-bar-item">
            <NavLink to="/market" target='_self' className='c-white hover:c-#5ec1d0'>
              {t('nav.market')}
            </NavLink>
          </li>
          <li className="nav-bar-item">
            <NavLink to="https://glyph.followfi.io" target='_blank' className='c-white hover:c-#5ec1d0'>
              {t('nav.glyph')}
            </NavLink>
          </li>
        </ul>
        <CustomConnectButton />
        <div className="nav-bar-dropdown">
          <Dropdown menu={{ items }} placement="bottomRight" overlayClassName="pt-12 text-12 box-border h18 w120">
            <Image width={30} height={30} preview={false} src={menuImage} />
          </Dropdown>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
