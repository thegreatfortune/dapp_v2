import { ConnectButton } from '@rainbow-me/rainbowkit'

const CustomConnectButton = () => {
  return <ConnectButton.Custom>
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

                <button onClick={openConnectModal} type="button" className='primary-btn w181 h60 font-size-18' >
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
                  className='w166 h40 text-14 c-purple bg-transparent rounded-full border-[#7189f7] '
                  style={{ display: 'flex', alignItems: 'center' }}
                  type="button"
                >
                  {chain.hasIcon && (
                    <div
                      className='w20 h20'
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
                          className='w20 h20'
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
              </div>
            )
          })()}
        </div>
      )
    }}
  </ConnectButton.Custom>
}

export default CustomConnectButton
