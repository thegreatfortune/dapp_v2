import React from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from './Navbar'
import Footer from './Footer'

interface IProps {
  children: React.ReactNode
  showInput?: boolean
}

const CenterLayout: React.FC<IProps> = (props) => {
  const { t } = useTranslation()

  return (
    <div className='relative min-h-full flex flex-col items-center bg-auto bg-auto bg-center bg-no-repeat bg-origin-border' style={{ backgroundImage: 'url(src/assets/images/market/marketBackground.svg)' }}>
      <header className='w-1400'>
        <Navbar title={t('nav.title')} showInput={props.showInput} />
      </header>

      <div className="h80 w-full" />

      <main className='w-1400 items-center'>
        {props.children}
      </main>

      <div className='h350' />

      <hr className='h3 w-full border-none bg-#303241' />

      <footer className='h198 w-1400'>
        <Footer />
      </footer>
    </div>
  )
}

export default CenterLayout