import React from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from './Navbar'
import useEthers from '@/hooks/useEthers'

interface IProps {
  children: React.ReactNode
}

const BasicLayout: React.FC<IProps> = (props) => {
  const { t } = useTranslation()

  const { signer } = useEthers()

  return (
    <div className='mx-147'>
      <header>
        <Navbar title={t('nav.title')} />
      </header>
      <main className='w-1400 mx-auto text-center'>
        {props.children}
      </main>
      <footer>
        {/* Footer content or component */}
      </footer>
    </div>
  )
}

export default BasicLayout
