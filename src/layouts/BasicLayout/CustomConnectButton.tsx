import { ConnectButton } from '@rainbow-me/rainbowkit'
import { debounce } from 'lodash-es'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { message } from 'antd'
import { ethers } from 'ethers'
import { UserInfoService } from '../../.generated/api/UserInfo'
import { MetamaskService } from '../../.generated/api/Metamask'
import UserDropdown from './UserDropdown'
import useUserStore from '@/store/userStore'
import useBrowserContract from '@/hooks/useBrowserContract'
import { UserService } from '@/.generated/api'

const CustomConnectButton = () => {
  const { address, isConnected } = useAccount()

  const { userList, switchActiveUser, setUserInfo } = useUserStore()

  const { resetProvider, initializeProvider, setNewProvider } = useBrowserContract()

  const { signIn, signOut } = useUserStore()

  const [canLogin, setCanLogin] = useState(false)

  async function login(address: string) {
    try {
      if (!address) {
        message.error('address cannot be empty')
        return
      }

      resetProvider()

      const newProvider = new ethers.BrowserProvider(window.ethereum)

      // await initializeProvider (newProvider)

      const signer = await newProvider.getSigner()

      const nonce = await MetamaskService.ApiMetamaskGetVerifyNonce_POST({ address })
      const signature = await signer?.signMessage(nonce)

      if (!signature) {
        message.error('signature cannot be empty')
        return
      }

      const res = await MetamaskService.ApiMetamaskLogin_POST({ address, sign: signature })
      console.log('%c [ res ]-52', 'font-size:13px; background:#605e08; color:#a4a24c;', res)

      // const res = await UserService.ApiUserLogin_POST({ address })

      signIn({ accessToken: res.accessToken, address })

      if (res.success) {
        const user = await UserInfoService.ApiUserInfo_GET()
        console.log('%c [ user ]-60', 'font-size:13px; background:#c0ecf2; color:#ffffff;', user)

        setUserInfo({ accessToken: res.accessToken, ...user, id: user.userId })
      }

      setNewProvider(newProvider)

      // await initializeProvider (newProvider)
    }
    catch (error) {
      // signOut()
      message.error('login failed')
      console.log('%c [ error ]-21', 'font-size:13px; background:#b7001f; color:#fb4463;', error)
      throw new Error('login failed')
    }
  }

  async function logInOrSwitching(address: string) {
    if (isConnected) {
      const havenUser = userList.find(user => ethers.getAddress(user.address ?? '') === ethers.getAddress(address))

      if (havenUser)
        switchActiveUser(havenUser)
      else
        await login(address)

      // window.location.reload()
    }
  }

  useEffect(() => {
    if (isConnected) {
      if (address && canLogin) {
        const havenUser = userList.find(user => ethers.getAddress(user.address ?? '') === ethers.getAddress(address))

        if (havenUser)
          switchActiveUser(havenUser)

        logInOrSwitching(address)
      }
    }
    else {
      signOut()
      // window.location.reload()
    }
  }, [isConnected, address, canLogin])

  if (!window.ethereum._accountsChangedHandler) {
    window.ethereum._accountsChangedHandler = debounce(async () => {
      setCanLogin(false)

      signOut()

      window.location.reload()

      // if (address)
      //   logInOrSwitching(address)
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
