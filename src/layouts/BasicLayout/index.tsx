import React from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from './Navbar'

interface IProps {
  children: React.ReactNode
  showInput?: boolean
}

const BasicLayout: React.FC<IProps> = ({ showInput, children }) => {
  const { t } = useTranslation()

  return (
    <div className='min-h-screen w-full flex flex-col items-center bg-cover bg-fixed bg-center bg-no-repeat bg-origin-border'
      style={{ backgroundImage: 'url(/static/marketBackground.svg)' }}
    >
      <header className='body-width'>
        <Navbar title={t('nav.title')} showInput={showInput} />
      </header>

      <div className="h30"></div>
      <main className='body-width h-full'>
        {children}
      </main>
      <div className='h-60'></div>
    </div>
  )
}

export default BasicLayout
