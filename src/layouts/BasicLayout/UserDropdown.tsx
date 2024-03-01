import { useAccountModal } from '@rainbow-me/rainbowkit'
import Dropdown from 'antd/es/dropdown'
import type { MenuProps } from 'antd/es/menu'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import React from 'react'
import myLoanImg from '@/assets/images/personal-center/myLoan.png'
import myFollowImg from '@/assets/images/personal-center/myFollow.png'
import personalImg from '@/assets/images/personal-center/Personal.png'
import disconnectImg from '@/assets/images/personal-center/Disconnect.png'

interface IProps {
  children: React.ReactNode
}

const UserDropdown: React.FC<IProps> = ({ children }) => {
  const { t } = useTranslation()

  const { openAccountModal } = useAccountModal()

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link className='flex items-center c-#fff' to={'/my-loan'} key='myLoan'>
          <img src={myLoanImg} alt="" className='mr-9 h15 w15' /> {t('nav.userMenu.myLoan')}
        </Link>

      ),
    },
    {
      key: '2',
      label: (
        <Link className='flex items-center c-#fff' to='/my-follow'>
          <img src={myFollowImg} alt="" className='mr-9 h15 w15' /> {t('nav.userMenu.myFollow')}
        </Link>

      ),
    },
    {
      key: 'personalCenter',
      label: (
        <Link className='flex items-center c-#fff' to='/personal-center'>
          <img src={personalImg} alt="" className='mr-9 h15 w15' /> {t('nav.userMenu.personalCenter')}
        </Link>

      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'signOut',
      label: (
        <a className='flex items-center c-#fff' onClick={openAccountModal}>
          <img src={disconnectImg} alt="" className='mr-9 h15 w15' /> {t('nav.userMenu.signOut')}
        </a>
      ),
    },
  ]
  return (
    <Dropdown menu={{ items }} placement="bottomRight" overlayClassName='pt-12 text-12 box-border h18'>
      {children}
    </Dropdown>
  )
}

export default UserDropdown
