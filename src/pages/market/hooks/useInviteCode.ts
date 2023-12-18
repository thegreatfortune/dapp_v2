import { message } from 'antd'
import { ethers } from 'ethers'
import { useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { MetamaskService, UserInfoService, UserInviteService } from '@/.generated/api'
import useUserStore from '@/store/userStore'
import useBrowserContract from '@/hooks/useBrowserContract'

const useInviteCode = () => {
  const { setUserInfo, signIn } = useUserStore()

  const { activeUser } = useUserStore()

  const { resetProvider, setNewProvider } = useBrowserContract()

  const location = useLocation()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const inviteCode = searchParams.get('inviteCode') || undefined

    if (inviteCode)
      login()
  }, [location])

  async function login() {
    if (activeUser.address) {
      const isInvited = await UserInviteService.ApiUserInviteInvitedOrNot_GET({ address: activeUser.address })
      if (isInvited)
        return
    }

    resetProvider()

    try {
      const newProvider = new ethers.BrowserProvider(window.ethereum)

      const signer = await newProvider.getSigner()

      const address = await signer.getAddress()

      const nonce = await MetamaskService.ApiMetamaskGetVerifyNonce_POST({ address })
      const signature = await signer?.signMessage(nonce)

      if (!signature) {
        message.error('signature cannot be empty')
        return
      }

      const res = await MetamaskService.ApiMetamaskLogin_POST({ address, sign: signature, inviteCode })

      signIn({ accessToken: res.accessToken, address })

      if (res.success) {
        const user = await UserInfoService.ApiUserInfo_GET()
        console.log('%c [ user ]-60', 'font-size:13px; background:#c0ecf2; color:#ffffff;', user)

        setUserInfo({ accessToken: res.accessToken, ...user, id: user.userId })
      }

      setNewProvider(newProvider)
    }
    catch (error) {
      message.error('login failed')
      console.log('%c [ error ]-21', 'font-size:13px; background:#b7001f; color:#fb4463;', error)
      throw new Error('login failed')
    }
  }
}

export default useInviteCode
