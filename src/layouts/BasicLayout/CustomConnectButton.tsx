import { ConnectButton } from '@rainbow-me/rainbowkit'
import UserDropdown from './UserDropdown'

const CustomConnectButton = () => {
  return <ConnectButton.Custom>
    {({
      account,
      chain,
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

                <button onClick={openConnectModal} type="button" className='h60 w181 rounded-6 font-size-18 primary-btn' >
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
              <div style={{ display: 'flex', gap: 12 }} className='items-center' >
                <button
                  onClick={openChainModal}
                  className='h40 w166 border-[#7189f7] rounded-full bg-transparent text-14 c-purple'
                  style={{ display: 'flex', alignItems: 'center' }}
                  type="button"
                >
                  {chain.hasIcon && (
                    <div
                      className='h20 w20'
                      style={{
                        background: chain.iconBackground,
                        borderRadius: 999,
                        overflow: 'hidden',
                        marginRight: 4,
                      }}
                    >
                      {chain.iconUrl && (
                        <img
                          alt={chain.name ?? 'Chain icon'}
                          src={chain.iconUrl}
                          className='h20 w20'
                        />
                      )}
                    </div>
                  )}
                  {chain.name}
                </button>

                {/* <button onClick={openAccountModal} type="button" className='w160 h60 text-14 c-orange '>
                                {account.displayName}
                                {account.displayBalance
                                  ? ` (${account.displayBalance})`
                                  : ''}
                            </button> */}

                <UserDropdown />
              </div>
            )
          })()}
        </div>
      )
    }}
  </ConnectButton.Custom>
}

export default CustomConnectButton
