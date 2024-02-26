import { ConnectButton } from '@rainbow-me/rainbowkit'
import { debounce } from 'lodash-es'
import type { PublicClient } from 'wagmi'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'
import { useEffect, useState } from 'react'
import { Avatar, message } from 'antd'
import { ethers } from 'ethers'
import { useLocation, useNavigate } from 'react-router-dom'
import type { GetAccountResult } from 'wagmi/actions'
import { watchAccount } from 'wagmi/actions'
import { UserInfoService } from '../../.generated/api/UserInfo'
import { MetamaskService } from '../../.generated/api/Metamask'
import UserDropdown from './UserDropdown'
import useUserStore from '@/store/userStore'
import useBrowserContract from '@/hooks/useBrowserContract'
import logo from '@/assets/images/portalImages/logo.png'

const CustomConnectButton = () => {
  const { userList, switchActiveUser, setUserInfo } = useUserStore()

  const { resetProvider, setNewProvider } = useBrowserContract()

  const { signIn, signOut, clear } = useUserStore()

  const [canLogin, setCanLogin] = useState(false)

  const navigator = useNavigate()

  const [inviteCode, setInviteCode] = useState<string>()

  const location = useLocation()

  const { chain } = useNetwork()

  const { activeUser } = useUserStore()



  const { isConnected } = useAccount(
    {
      async onConnect({ address, connector, isReconnected }) {
        // const getChainId = await connector?.getChainId()
        if (address && canLogin) {
          const havenUser = userList.find(user => ethers.getAddress(user.address ?? '') === ethers.getAddress(address))

          if (havenUser)
            switchActiveUser(havenUser)

          // logInOrSwitching(address)
          await login(address)
        }
      },
      onDisconnect() {
        // signOut()
        clear()
        navigator('/market')
      },
    },
  )

  async function login(address?: string) {
    try {
      if (!address)
        return

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

      const res = await MetamaskService.ApiMetamaskLogin_POST({ address, sign: signature, inviteCode })
      // const res = await UserService.ApiUserLogin_POST({ address })

      // const res = await UserService.ApiUserLogin_POST({ address })

      signIn({ accessToken: res.accessToken, address, chainId: chain?.id })

      if (res.success) {
        const user = await UserInfoService.ApiUserInfo_GET()

        console.log('when user login:', user)

        setUserInfo({ accessToken: res.accessToken, chainId: chain?.id, ...user, id: user.userId })
      }

      setNewProvider(newProvider)

      // await initializeProvider (newProvider)
    }
    catch (error) {
      clear()
      navigator('/market')
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
    }
  }

  const debouncedCallback = debounce((account: GetAccountResult<PublicClient>) => {
    // setCanLogin(false)
    if (account)
      logInOrSwitching(account.address as string)
  }, 1000)

  useEffect(() => {
    const unwatch = watchAccount((account) => {
      debouncedCallback(account)
    })

    return () => {
      unwatch()
    }
  }, [])

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

      useEffect(() => {
        const searchParams = new URLSearchParams(location.search)
        const inviteCode = searchParams.get('inviteCode') || undefined

        if (inviteCode !== undefined)
          setInviteCode(inviteCode)

        if (location.pathname === '/market' && inviteCode)
          onOpenConnectModal()
      }, [location])

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
                  <button onClick={onOpenConnectModal} type="button" className='connect-wallet' >
                    Connect Wallet
                  </button>
                </div>
              )
            }

            if (chain.unsupported) {
              return (
                <button onClick={openChainModal} type="button">
                  Wrong Network !
                </button>
              )
            }

            return (
              <div style={{ display: 'flex', gap: 12 }} className='items-center' >
                <div className="">
                  <button
                    onClick={openChainModal}
                    className='user-chain-logo'
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        className='h25 w25'
                        style={{
                          background: chain.iconBackground,
                          borderRadius: 999,
                          overflow: 'hidden',
                        }}
                      >
                        {chain.iconUrl && (
                          <Avatar src={chain.iconUrl} className='h25 w25' />
                        )}
                      </div>
                    )}
                    <div className='network-name ml-5'>{chain.name}</div>
                  </button>
                </div>

                {/* <button onClick={openAccountModal} type="button" className='w160 h60 text-14 c-orange '>
                                {account.displayName}
                                {account.displayBalance
                                  ? ` (${account.displayBalance})`
                                  : ''}
                            </button> */}

                <UserDropdown>
                  <button className="user-chain-logo" type="button">

                    {/* <a onClick={e => e.preventDefault()}> */}
                    <div className='h25 w25'>
                      <Avatar
                        src={activeUser.pictureUrl ? activeUser.pictureUrl : logo}
                        className="h25 w25 bg-slate-200" />
                      {/* </a> */}
                    </div>
                    <div className='truncate user-address ml-5 '>{account.displayName}</div>
                  </button>
                </UserDropdown>
              </div>
            )
          })()}
        </div>
      )
    }}
  </ConnectButton.Custom>
}

export default CustomConnectButton
