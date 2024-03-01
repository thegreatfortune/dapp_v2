import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId, useDisconnect, useSignTypedData } from 'wagmi'
import { useEffect, useState } from 'react'
import { Avatar, message, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { getTypesForEIP712Domain, isHex, stringify } from 'viem'
import { UserInfoService } from '../../.generated/api/UserInfo'
import { MetamaskService } from '../../.generated/api/Metamask'
import UserDropdown from './UserDropdown'
import useUserStore from '@/store/userStore'
import logo from '@/assets/images/portalImages/logo.png'
import { MessageError } from '@/enums/error'
import { NotificationInfo } from '@/enums/info'

const CustomConnectButton = () => {
  const { userLogin, userLogout, currentUser, users } = useUserStore()

  const navigator = useNavigate()

  const [inviteCode, setInviteCode] = useState<string>()

  const chainId = useChainId()

  const { disconnect } = useDisconnect()

  const { address } = useAccount({
    // onConnect() { login() },
    onDisconnect() {
      userLogout()
      navigator('/follows')
    },
  })

  const { signTypedDataAsync } = useSignTypedData()

  interface TypedData {
    domain: {
      name: string
      chainId: number
      version: string
      // verifyingContract: string
      // salt: string
    }
    types: {
      EIP712Domain?: {
        name: string
        type: string | number
      }[]
      Message: {
        name: string
        type: string
      }[]
    }
    primaryType: 'Message'
    message: {
      Content: string
      URL: string
      Wallet: string
      Nonce: string
      ChainId: string
      Version: string
      Date: string
    }
    // [key: string]: TypedDataField[] | string
  }

  const login = async () => {
    console.info('Logging in....')
    // const navigator = useNavigate()
    // const chainId = useChainId()
    // const { disconnect } = useDisconnect()
    // const { address } = useAccount()
    // const { signTypedDataAsync } = useSignTypedData()
    // const { userLogin, userLogout, currentUser, users } = useUserStore()
    // const [inviteCode, setInviteCode] = useState<string>()

    console.log('111', address, currentUser.address)
    const nonce = await MetamaskService.ApiMetamaskGetVerifyNonce_POST(chainId, { address: address as string })
    const now = dayjs()
    const originUser = users.find(e => e.address === address as string)
    if (originUser && originUser.nonce === nonce) {
      const userInfo = await UserInfoService.getUserInfo(chainId, { headers: { 'Authorization': originUser.accessToken, 'Chain-Id': originUser.chainId } })
      userLogin({ ...originUser, ...userInfo, address: address as string })
      notification.info({
        message: NotificationInfo.LogInSuccessfully,
        description: 'Welcome back to Follow Finance!',
        placement: 'bottomRight',
      })
      setTimeout(() => {
        location.reload()
      }, 3000)
    }
    else {
      const typedData: TypedData = {
        domain: {
          name: 'Follow Finance',
          chainId,
          version: '1',
          // verifyingContract: import.meta.env.VITE_CORE_PROCESS_CENTER,
          // salt: hashMessage('Follow Finance Dapp'),
        },
        message: {
          Content: 'Welcome to Follow Finance App!',
          URL: window.location.origin,
          Wallet: address as string,
          Nonce: nonce,
          ChainId: chainId.toString(),
          Version: '1',
          Date: now.format(),
        },
        primaryType: 'Message',
        types: {
          Message: [
            { name: 'Content', type: 'string' },
            { name: 'URL', type: 'string' },
            { name: 'Wallet', type: 'string' },
            { name: 'Nonce', type: 'string' },
            { name: 'ChainId', type: 'string' },
            { name: 'Version', type: 'string' },
            { name: 'Date', type: 'string' },
          ],
        },
      }

      try {
        const signature = await signTypedDataAsync({ ...typedData })

        typedData.types = {
          EIP712Domain: getTypesForEIP712Domain({ domain: typedData.domain }),
          ...typedData.types,
        }
        const res = await MetamaskService.ApiMetamaskLogin_POST(chainId, {
          address: address as string,
          sign: signature,
          rawMessage: stringify(typedData, (_, value) => (isHex(value) ? value.toLowerCase() : value)),
          inviteCode,
        })
        if (res.success) {
          const user = await UserInfoService.getUserInfo(chainId, { headers: { 'Authorization': res.accessToken, 'Chain-Id': chainId } })
          userLogin({
            ...user,
            address: address as string,
            accessToken: res.accessToken,
            chainId,
            nonce,
          })

          notification.info({
            message: NotificationInfo.LogInSuccessfully,
            description: 'Welcome to Follow Finance!',
            placement: 'bottomRight',
          })
          setTimeout(() => {
            if (!originUser) {
              if (location.pathname !== '/personal-center')
                navigator('/personal-center')
              else
                location.reload()
            }
          }, 3000)
        }
        else {
          message.error(MessageError.LoginFailed)
          userLogout()
          disconnect()
          setTimeout(() => {
            if (location.pathname !== '/follows')
              navigator('/follows')
          }, 3000)
        }
      }
      catch (error) {
        console.error(error)
        message.error(MessageError.SiganMessageError)
        userLogout()
        disconnect()
        setTimeout(() => {
          if (location.pathname !== '/follows')
            navigator('/follows')
        }, 3000)
      }
    }
  }

  // async function login_old(address?: string) {
  //   try {
  //     if (!address)
  //       return

  //     resetProvider()

  //     const newProvider = new ethers.BrowserProvider(window.ethereum)

  //     // await initializeProvider (newProvider)

  //     const signer = await newProvider.getSigner()

  //     const nonce = await MetamaskService.ApiMetamaskGetVerifyNonce_POST({ address })

  //     const signature = await signer?.signMessage(nonce)

  //     console.log('nonce:', nonce)

  //     if (!signature) {
  //       message.error('signature cannot be empty')
  //       return
  //     }

  //     const res = await MetamaskService.ApiMetamaskLogin_POST({ address, sign: signature, inviteCode, rawMessage: '' })
  //     // const res = await UserService.ApiUserLogin_POST({ address })

  //     // const res = await UserService.ApiUserLogin_POST({ address })

  //     signIn({ accessToken: res.accessToken, address, chainId: chain?.id })

  //     if (res.success) {
  //       const user = await UserInfoService.ApiUserInfo_GET()

  //       console.log('The user logged in:', user)

  //       setUserInfo({ accessToken: res.accessToken, chainId: chain?.id, ...user, id: user.userId })
  //     }

  //     setNewProvider(newProvider)

  //     // await initializeProvider (newProvider)
  //   }
  //   catch (error) {
  //     reset()
  //     navigator('/follows')
  //     message.error('login failed')
  //     console.log('%c [ error ]-21', 'font-size:13px; background:#b7001f; color:#fb4463;', error)
  //     throw new Error('login failed')
  //   }
  // }

  useEffect(() => {
    console.log(address, currentUser.address)
    if (address && address !== currentUser.address)
      login()
  }, [address])

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

                <UserDropdown>
                  <button className="user-chain-logo" type="button">

                    {/* <a onClick={e => e.preventDefault()}> */}
                    <div className='h25 w25'>
                      <Avatar
                        src={currentUser.pictureUrl ? currentUser.pictureUrl : logo}
                        className="h25 w25 bg-slate-200" />
                      {/* </a> */}
                    </div>
                    <div className='user-address ml-5 truncate'>{account.displayName}</div>
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
