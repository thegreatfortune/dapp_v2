import { useAccount, useChainId, useDisconnect, useSignTypedData } from 'wagmi'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { message, notification } from 'antd'
import { getTypesForEIP712Domain, isHex, stringify } from 'viem'
import { useState } from 'react'
import { MetamaskService, UserInfoService } from '@/.generated/api'
import useUserStore from '@/store/userStore'
import { NotificationInfo } from '@/enums/info'
import { MessageError } from '@/enums/error'

/* eslint-disable @typescript-eslint/indent */
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
    const navigator = useNavigate()
    const chainId = useChainId()
    const { disconnect } = useDisconnect()
    const { address } = useAccount()
    const { signTypedDataAsync } = useSignTypedData()
    const { userLogin, userLogout, currentUser, users } = useUserStore()
    const [inviteCode, setInviteCode] = useState<string>()

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

export {
    login,
}
