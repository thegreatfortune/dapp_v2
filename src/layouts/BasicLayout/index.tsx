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

   <div className='min-h-screen w-full flex flex-col items-center bg-cover bg-fixed bg-center bg-no-repeat bg-origin-border' style={{ backgroundImage: 'url(src/assets/images/market/marketBackground.svg)' }}>
      <header className='w-1400'>
        <Navbar title={t('nav.title')} showInput={showInput} />
      </header>

      <div className="h30 w-full" />

      <main className='h-full w-1400 items-center'>
        {children}
      </main>

      {/* <div className='h70' /> */}

      {/* <hr className='h3 w-full border-none bg-#303241' /> */}

      {/* <footer className='h198 w-1400'><Footer /></footer> */}

      <div className='h-60 w-full' />
    </div>
  )
}

export default BasicLayout
