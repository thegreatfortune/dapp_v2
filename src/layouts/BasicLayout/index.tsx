import React from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from './Navbar'

interface IProps {
  children: React.ReactNode
}

const BasicLayout: React.FC<IProps> = (props) => {
  const { t } = useTranslation()

  window.ethereum.on('accountsChanged', () => {
    window.location.reload()
  })

  return (
    <div className='flex flex-col items-center'>
      <header className='w-1400'>
        <Navbar title={t('nav.title')} />
      </header>
      <main className='w-1400 items-center'>
        {props.children}
      </main>
      <footer>
        {/* Footer content or component */}
      </footer>
    </div>
  )
}

export default BasicLayout
