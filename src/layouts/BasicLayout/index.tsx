import React from 'react'
import Navbar from './Navbar'

interface IProps {
  children: React.ReactNode
}

export const BasicLayout: React.FC<IProps> = (props) => {
  return (
    <div className='mx-147'>
      <header>
        <Navbar title={import.meta.env.VITE_DAPP_TITLE} />
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
