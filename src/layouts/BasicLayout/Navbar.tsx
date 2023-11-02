import { ConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'
import { Avatar, Input } from 'antd'
import logo from '@/assets/react.svg'

interface NavbarProps {
  title: string
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  return (
        <nav className="h25 mt-11 theme-color text-white flex justify-around items-center">
            <div className="text-center flex items-center">
                <Avatar src={logo} className='w15 h15 mx1.25'></Avatar>
                <div className="text-xl font-size-10">{title}</div>
            </div>

            <ul className="min-w-84.75 flex justify-around list-none text-[#D2D2D2]">
                <li className="hover:text-white hover:font-bold inline-block transform transition-transform scale-100 hover:scale-110">
                    Home
                </li>
                <li className="hover:text-white hover:font-bold inline-block transform transition-transform scale-100 hover:scale-110">
                    Marketplace
                </li>
                <li className="hover:text-white hover:font-bold inline-block transform transition-transform scale-100 hover:scale-110">
                    Transaction
                </li>
            </ul>

            <Input
                placeholder="Basic usage"
                className="w-145 h-15 px-7.5 inline-block c-white border-white bg-transparent placeholder-c-[#D2D2D2]  placeholder-font-size-3.5"
            />

            <div className="space-x-4">

                <ConnectButton.Custom>
                    {({
                      account,
                      chain,
                      openAccountModal,
                      openChainModal,
                      openConnectModal,
                      authenticationStatus,
                      mounted,
                    }) => {
                      // Note: If your app doesn't use authentication, you
                      // can remove all 'authenticationStatus' checks
                      const ready = mounted && authenticationStatus !== 'loading'
                      const connected
                            = ready
                            && account
                            && chain
                            && (!authenticationStatus
                                || authenticationStatus === 'authenticated')

                      return (
                            <div

                                {...(!ready && {
                                  'aria-hidden': true,
                                  'style': {
                                    opacity: 0,
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                  },
                                })}
                            >
                                {(() => {
                                  if (!connected) {
                                    return (

                                            <button onClick={openConnectModal} type="button" className='primary-btn w45.25 h15' >
                                                Connect Wallet
                                            </button>
                                    )
                                  }

                                  if (chain.unsupported) {
                                    return (
                                            <button onClick={openChainModal} type="button">
                                                Wrong network
                                            </button>
                                    )
                                  }

                                  return (
                                        <div style={{ display: 'flex', gap: 12 }} >
                                            <button
                                                onClick={openChainModal}
                                                style={{ display: 'flex', alignItems: 'center' }}
                                                type="button"
                                            >
                                                {chain.hasIcon && (
                                                    <div
                                                        style={{
                                                          background: chain.iconBackground,
                                                          width: 12,
                                                          height: 12,
                                                          borderRadius: 999,
                                                          overflow: 'hidden',
                                                          marginRight: 4,
                                                        }}
                                                    >
                                                        {chain.iconUrl && (
                                                            <img
                                                                alt={chain.name ?? 'Chain icon'}
                                                                src={chain.iconUrl}
                                                                style={{ width: 12, height: 12 }}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                                {chain.name}
                                            </button>

                                            <button onClick={openAccountModal} type="button">
                                                {account.displayName}
                                                {account.displayBalance
                                                  ? ` (${account.displayBalance})`
                                                  : ''}
                                            </button>
                                        </div>
                                  )
                                })()}
                            </div>
                      )
                    }}
                </ConnectButton.Custom>
            </div>
        </nav>
  )
}

export default Navbar
