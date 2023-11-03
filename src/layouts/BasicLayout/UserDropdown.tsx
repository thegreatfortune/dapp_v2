import { useAccountModal } from '@rainbow-me/rainbowkit'
import { Dropdown, type MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const UserDropdown = () => {
  const { t } = useTranslation()

  const { openAccountModal } = useAccountModal()

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a className='my-12 h18 text-12'>
          {t('nav.menu.loan')}
        </a>

      ),
    },
    {
      key: '2',
      label: (
        <a className='my-12 h18 text-12' target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          {t('nav.menu.follow')}
        </a>

      ),
    },
    {
      key: 'personalCenter',
      label: (
        <Link className='my-12 h18 text-12' to='/personal-center'>
          {t('nav.menu.personalCenter')}
        </Link>

      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'signOut',
      label: (
        <a className='my-12 h18 text-12' onClick={openAccountModal}>
          {t('nav.menu.signOut')}
        </a>
      ),
    },
  ]
  return (
    <Dropdown menu={{ items }} placement="bottomRight" overlayClassName='pt-12 text-12 w166 box-border'>
      <a onClick={e => e.preventDefault()}>
        <div>
          User
        </div>
      </a>
    </Dropdown>
  )
}

export default UserDropdown
