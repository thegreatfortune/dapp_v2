import { ConnectButton } from '@rainbow-me/rainbowkit'
import { debounce } from 'lodash-es'
import { UserService } from '../../.generated/api/User'
import UserDropdown from './UserDropdown'
import useUserStore from '@/store/userStore'

const CustomConnectButton = () => {
  const { signIn } = useUserStore()

  if (!window.ethereum._accountsChangedHandler) {
    window.ethereum._accountsChangedHandler = debounce(async (addressList: string[]) => {
      const [address] = addressList
      console.log('%c [ address ]-13', 'font-size:13px; background:#1dcc2b; color:#61ff6f;', address)

      if (address) {
        try {
          const res = await UserService.ApiUserLogin_POST({ address })

          if (res.success)
            signIn({ address, accessToken: res.accessToken })

          const user = await UserService.ApiUserUserInfo_GET()
          console.log('%c [ user ]-23', 'font-size:13px; background:#27737f; color:#6bb7c3;', user)

          signIn({ address, accessToken: res.accessToken, id: user.userId })
        }
        catch (error) {
          console.log('%c [ error ]-16', 'font-size:13px; background:#b3d82d; color:#f7ff71;', error)
        }
      }

      window.location.reload()
    }, 1000)
  }

  window.ethereum.on('accountsChanged', window.ethereum._accountsChangedHandler)

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
