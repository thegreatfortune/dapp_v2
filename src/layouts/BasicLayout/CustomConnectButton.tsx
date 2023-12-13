import { ConnectButton } from '@rainbow-me/rainbowkit'
import { debounce } from 'lodash-es'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { message } from 'antd'
import { UserService } from '../../.generated/api/User'
import { MetamaskService } from '../../.generated/api/Metamask'
import UserDropdown from './UserDropdown'
import useUserStore from '@/store/userStore'
import useBrowserContract from '@/hooks/useBrowserContract'

const CustomConnectButton = () => {
  const { address, isConnected } = useAccount()

  const { resetProvider, signer } = useBrowserContract()

  const { signIn, signOut } = useUserStore()

  const [canLogin, setCanLogin] = useState(false)

  async function login(address: string) {
    try {
      const nonce = await MetamaskService.ApiMetamaskGetVerifyNonce_POST({ address })
      console.log('%c [ nonce ]-24', 'font-size:13px; background:#32fa14; color:#76ff58;', nonce)

      if (!nonce)
        return

      const signature = await signer?.signMessage('555555555555555555555555555')

      console.log('%c [ signature ]-35', 'font-size:13px; background:#21ce2a; color:#65ff6e;', signature)

      const res = await MetamaskService.ApiMetamaskLogin_POST({ address, sign: signature })

      if (res.success)
        signIn({ address, accessToken: res.accessToken })

      const user = await UserService.ApiUserUserInfo_GET()

      signIn({ accessToken: res.accessToken, id: user.userId, ...user })

      resetProvider()

      setCanLogin(false)

      // window.location.reload()
    }
    catch (error) {
      message.error('login failed')
      console.log('%c [ error ]-21', 'font-size:13px; background:#b7001f; color:#fb4463;', error)
      throw new Error('login failed')
    }
  }

  useEffect(() => {
    if (isConnected)
      address && canLogin && login(address as string)
    else signOut()
  }, [isConnected])

  if (!window.ethereum._accountsChangedHandler) {
    window.ethereum._accountsChangedHandler = debounce(async (addressList: string[]) => {
      const [address] = addressList

      if (address) {
        try {
          login(address)
        }
        catch (error) {
          console.log('%c [ error ]-16', 'font-size:13px; background:#b3d82d; color:#f7ff71;', error)
        }
      }
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

      async function onOpenConnectModal() {
        openConnectModal()
        setCanLogin(true)
      }

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

                <button onClick={onOpenConnectModal} type="button" className='h60 w181 rounded-30 font-size-18 primary-btn' >
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
