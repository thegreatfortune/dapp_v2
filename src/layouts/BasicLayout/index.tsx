import React from 'react'
import Navbar from './Navbar'

interface IProps {
  children: React.ReactNode
}

export const BasicLayout: React.FC<IProps> = (props) => {
  return (
        <div className='mx-37'>
                <header>
                    <Navbar title={import.meta.env.VITE_DAPP_TITLE} />
                </header>
                <main >
                    {props.children}
                </main>
                <footer>
                    {/* Footer content or component */}
                </footer>
        </div>
  )
}
