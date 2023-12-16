import { useAccountModal } from '@rainbow-me/rainbowkit'
import { Avatar } from 'antd'
import Dropdown from 'antd/es/dropdown'
import type { MenuProps } from 'antd/es/menu'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import useUserStore from '@/store/userStore'
import myLoanImg from '@/assets/images/personal-center/myLoan.png'
import myFollowImg from '@/assets/images/personal-center/myFollow.png'
import personalImg from '@/assets/images/personal-center/Personal.png'
import disconnectImg from '@/assets/images/personal-center/Disconnect.png'

const UserDropdown = () => {
  const { t } = useTranslation()

  const { openAccountModal } = useAccountModal()

  const { activeUser } = useUserStore()

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link className='flex items-center c-#fff' to={'/my-loan'} key='myLoan'>
        <img src={myLoanImg} alt="" className='mr-9 h15 w15'/> {t('nav.menu.loan')}
        </Link>

      ),
    },
    {
      key: '2',
      label: (
        <Link className='flex items-center c-#fff' to='/my-lend'>
          <img src={myFollowImg} alt="" className='mr-9 h15 w15'/> {t('nav.menu.follow')}
        </Link>

      ),
    },
    {
      key: 'personalCenter',
      label: (
        <Link className='flex items-center c-#fff' to='/personal-center'>
          <img src={personalImg} alt="" className='mr-9 h15 w15'/> {t('nav.menu.personalCenter')}
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
          <img src={disconnectImg} alt="" className='mr-9 h15 w15'/> {t('nav.menu.signOut')}
        </a>
      ),
    },
  ]
  return (
    <Dropdown menu={{ items }} placement="bottomRight" overlayClassName='pt-12 text-12 box-border h18'>
      <a onClick={e => e.preventDefault()}>
      <Avatar src={activeUser.pictureUrl} className="mx6 h34 w34"/>
      </a>
    </Dropdown>
  )
}

export default UserDropdown
