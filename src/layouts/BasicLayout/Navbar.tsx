import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router-dom'
import Image from 'antd/es/image'
import { AutoComplete } from 'antd'
import BigNumber from 'bignumber.js'
import CustomConnectButton from './CustomConnectButton'
import logo from '@/assets/images/LOGO.svg'
import searchImg from '@/assets/images/search.png'
import { Models } from '@/.generated/api/models'
import { LoanService } from '@/.generated/api/Loan'
import { isContractAddress, isTwitterHandle } from '@/utils/regex'

interface NavbarProps {
  title: string
  showInput?: boolean
}

const Navbar: React.FC<NavbarProps> = ({ showInput }) => {
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

  return (
    <nav className="h100 w-full flex items-center justify-between text-white" id='navBar'>
      <div className="flex items-center text-center">
        <Image src={logo} width={120} height={40}></Image>
      </div>

      <ul className="flex list-none justify-around p0 text-center font-size-16 c-white">
        <li className="inline-block">
          <NavLink to="/portal" target='_blank' className='c-white hover:font-bold hover:c-#5ec1d0'>
            {t('nav.home')}
          </NavLink>
        </li>
        <li className="ml-30 inline-block">
          <NavLink to="/market" target='_self' className='c-white hover:font-bold hover:c-#5ec1d0' >
            {t('nav.market')}
          </NavLink>
        </li>
        <li className="ml-30 inline-block">
          <NavLink to="/trade" target='_self' className='c-white hover:font-bold hover:c-#5ec1d0'>
            {t('nav.trade')}
          </NavLink>
        </li>
      </ul>

      {
        showInput
        && <div className='relative box-border h48 w310'>

          <AutoComplete
            popupClassName="certain-category-search-dropdown"
            options={options}
            onSearch={handleSearch}
            onSelect={onSelect}
            className="h48 w310"
          >
            <input className="h48 w310 border-1 border-white rounded-24 border-solid bg-#040508 p-x-30 p-y13 c-white placeholder-c-#D2D2D2" placeholder={t('basicLayout.navBar.placeholder')} type="text" />
          </AutoComplete>
          <Image width={16} height={16} preview={false} className='absolute right--266 top--34 z-1' src={searchImg} />

        </div>
      }

      <CustomConnectButton />

    </nav>
  )
}

export default Navbar
