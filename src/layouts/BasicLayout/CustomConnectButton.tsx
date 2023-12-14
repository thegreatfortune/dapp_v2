import { ConnectButton } from '@rainbow-me/rainbowkit'
import { debounce } from 'lodash-es'
import { useAccount, useConnect } from 'wagmi'
import { useEffect, useState } from 'react'
import { message } from 'antd'
import { UserInfoService } from '../../.generated/api/UserInfo'
import { MetamaskService } from '../../.generated/api/Metamask'
import UserDropdown from './UserDropdown'
import useUserStore from '@/store/userStore'
import useBrowserContract from '@/hooks/useBrowserContract'

const CustomConnectButton = () => {
  const { address, isConnected } = useAccount()

  const { activeUser, userList, switchActiveUser, setUserInfo } = useUserStore()

  const { resetProvider, signer } = useBrowserContract()

  const { signIn, signOut } = useUserStore()

  const [canLogin, setCanLogin] = useState(false)

  // function getNonce() {

  // }

  async function login(address: string) {
    try {
      resetProvider()

      if (!signer)
        return login(address)
        // message.error('signer cannot be empty')
        // return

      const nonce = await MetamaskService.ApiMetamaskGetVerifyNonce_POST({ address })
      console.log('%c [ nonce ]-29', 'font-size:13px; background:#ca6f56; color:#ffb39a;', nonce)
      const signature = await signer?.signMessage(nonce)

      if (!signature) {
        message.error('signature cannot be empty')
        return
      }

      const res = await MetamaskService.ApiMetamaskLogin_POST({ address, sign: signature })

      signIn({ accessToken: res.accessToken, address })

      if (res.success) {
        const user = await UserInfoService.ApiUserInfo_GET()
        console.log('%c [ user ]-83', 'font-size:13px; background:#eb01a1; color:#ff45e5;', user)

        setUserInfo({ accessToken: res.accessToken, ...user })

        // signIn({ accessToken: res.accessToken, address, ...user })
      }

      // window.location.reload()
    }
    catch (error) {
      signOut()
      message.error('login failed')
      console.log('%c [ error ]-21', 'font-size:13px; background:#b7001f; color:#fb4463;', error)
      throw new Error('login failed')
    }
  }

  useEffect(() => {
    if (isConnected) {
      if (address && canLogin) {
        const havenUser = userList.find(user => user.address === address)

        if (havenUser)
          switchActiveUser(havenUser)
        else
          login(address)
      }
    }
    else {
      signOut()
    }
  }, [isConnected, address])

  if (!window.ethereum._accountsChangedHandler) {
    window.ethereum._accountsChangedHandler = debounce(async () => {
      signOut()
    }, 1000)
  }

  // if (!window.ethereum._accountsChangedHandler) {
  //   window.ethereum._accountsChangedHandler = debounce(async (addressList: string[]) => {
  //     if (!isConnected)
  //       return

  //     const [address] = addressList

  //     if (address) {
  //       try {
  //         const havenUser = userList.find(user => user.address === address && user.id)

  //         if (havenUser)
  //           switchActiveUser(havenUser)
  //         else
  //           login(address)
  //       }
  //       catch (error) {
  //         console.log('%c [ error ]-16', 'font-size:13px; background:#b3d82d; color:#f7ff71;', error)
  //       }
  //     }
  //   }, 1000)
  // }

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

                <div>
                  <button onClick={onOpenConnectModal} type="button" className='h60 w181 rounded-30 font-size-18 primary-btn' >
                    Connect Wallet
                  </button>
                </div>

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
