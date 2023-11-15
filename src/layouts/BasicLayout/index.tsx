import React from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from './Navbar'
import Footer from './Footer'

interface IProps {
  children: React.ReactNode
}

const BasicLayout: React.FC<IProps> = (props) => {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col items-center'>
      <header className='w-1400'>
        <Navbar title={t('nav.title')} />
      </header>
      <main className='w-1400 items-center'>
        {props.children}
      </main>

      <div className='h70' />

      <hr className='h3 w-full border-none bg-#303241' />

      <footer className='h198 w-1400'>
        <Footer />
      </footer>
    </div>
  )
}

export default BasicLayout
