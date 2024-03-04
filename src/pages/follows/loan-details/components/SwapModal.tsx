import type { ModalProps } from 'antd'
import { Button, Input, Modal, message } from 'antd'
import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { SyncOutlined } from '@ant-design/icons'
import type { TokenInfo } from './Pool'
import useBrowserContract from '@/hooks/useBrowserContract'
import { ChainAddressEnums } from '@/enums/chain'
import { useChainId } from 'wagmi'

// import exChange from '@/assets/images/loan-details/exchange.png'
// import FolCoin from '@/assets/images/loan-details/FolCoin.png'

interface IProps extends ModalProps {
  currentTokenInfo: TokenInfo
  tradeId: bigint | null
  resetSwapTokenInfo: () => Promise<void>
}

class SwapInfo {
  token: string | undefined
  address: string | undefined
  amount: string = ''
}

const SwapModal: React.FC<IProps> = (props) => {
  // console.log(111, props.currentTokenInfo)
  const chainId = useChainId()

  const { browserContractService } = useBrowserContract()

  const [loading, setLoading] = useState(false)

  const [swaping, setSwaping] = useState<boolean>(false)

  const [swapBnText, setSwapBnText] = useState('Enter an amount')

  const [youPay, setYouPay] = useState<SwapInfo>({
    token: 'USDC',
    address: ChainAddressEnums[chainId].USDC,
    amount: '',
  })

  const [youReceiver, setYouReceiver] = useState<SwapInfo>({
    token: props.currentTokenInfo.name,
    address: props.currentTokenInfo.address,
    amount: '',
  })

  const [ratio, setRatio] = useState<string>('0')

  const [activeInput, setActiveInput] = useState<'youPay' | 'youReceiver'>('youPay')

  useEffect(() => {
    async function fetchData() {
      if (!browserContractService || !props.currentTokenInfo.address)
        return

      setYouPay(() => ({
        token: 'USDC',
        address: ChainAddressEnums[chainId].USDC,
        amount: '',
      }))

      const newRatio = await browserContractService.testLiquidity_calculateSwapRatio(props.currentTokenInfo.address)
      setRatio(newRatio)
      console.log('%c [ newRatio ]-64', 'font-size:13px; background:#2f2c72; color:#7370b6;', newRatio)

      setYouReceiver(() => ({
        token: props.currentTokenInfo.name,
        address: props.currentTokenInfo.address,
        amount: BigNumber((youPay.amount || 0)).multipliedBy(newRatio).toString(),
      }))
      // }
    }

    fetchData()
  }, [browserContractService, props.currentTokenInfo])

  const onSetYouPay = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value.replace(/[^0-9.]/g, '')

    const isValidNumber
      = !Number.isNaN(Number.parseFloat(newAmount)) && Number.isFinite(Number.parseFloat(newAmount))

    setYouPay({
      ...youPay,
      amount: isValidNumber ? newAmount : '',
    })

    const calculatedAmount = BigNumber(isValidNumber ? newAmount : '0').multipliedBy(ratio).toFixed(4)

    const swapCalculatedAmount = BigNumber(isValidNumber ? newAmount : '0').dividedBy(ratio).toFixed(4)

    // Update the corresponding field based on the activeInput flag
    setYouReceiver({
      ...youReceiver,
      amount: activeInput === 'youPay' ? calculatedAmount : swapCalculatedAmount,
    })
  }

  const onSetYouReceiver = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value.replace(/[^0-9.]/g, '')

    const isValidNumber
      = !Number.isNaN(Number.parseFloat(newAmount)) && Number.isFinite(Number.parseFloat(newAmount))

    setYouReceiver({
      ...youReceiver,
      amount: isValidNumber ? newAmount : '0',
    })

    const calculatedAmount = BigNumber(isValidNumber ? newAmount : '0').dividedBy(ratio).toFixed(4)
    const swapCalculatedAmount = BigNumber(isValidNumber ? newAmount : '0').multipliedBy(ratio).toFixed(4)

    // Update the corresponding field based on the activeInput flag
    setYouPay({
      ...youPay,
      amount: activeInput === 'youReceiver' ? swapCalculatedAmount : calculatedAmount,
    })
  }

  const onSwap = () => {
    setActiveInput(prevInput => (prevInput === 'youPay' ? 'youReceiver' : 'youPay'))

    const tempYouPay = { ...youPay }
    const tempYouReceiver = { ...youReceiver }

    setYouPay({
      ...tempYouReceiver,
    })

    setYouReceiver({
      ...tempYouPay,
    })
  }

  async function enterAnAmount() {
    if (!props.tradeId)
      return
    setSwaping(true)
    setSwapBnText('swaping')
    setLoading(true)

    let tokenInformation = new SwapInfo()

    let buyOrSell = 0 //  1为_token买入USDC操作,非1为卖出USDC换成_token

    if (youPay.token === 'USDC') {
      buyOrSell = 0
      tokenInformation.token = youReceiver.token
      tokenInformation.address = youReceiver.address
      tokenInformation.amount = youPay.amount
    }
    else {
      // const index = tokenList.findIndex(e => e.address === youPay.address)

      buyOrSell = 1
      // buyOrSell = index
      tokenInformation = youPay
      // tokenInformation.amount = youPay.amount
    }

    // console.log(buyOrSell, tokenInformation, youPay, youReceiver)

    // console.log(333, youPay)
    // console.log(444, youReceiver)

    if (!tokenInformation?.address) {
      message.error('address is undefined')
      return
    }

    try {
      const res = await browserContractService?.followRouter_doV3Swap(props.tradeId, tokenInformation.address, BigInt(buyOrSell), ethers.parseEther(tokenInformation.amount))
      if (res?.status === 1)
        await props.resetSwapTokenInfo()
    }
    catch (error) {
      console.log('%c [ error ]-152', 'font-size:13px; background:#857ff5; color:#c9c3ff;', error)
    }

    finally {
      setSwaping(false)
      setSwapBnText('Enter an amount')
      setLoading(true)
    }
  }

  function afterClose() {
    setActiveInput('youPay')

    setYouPay(
      {
        token: 'USDC',
        address: import.meta.env.VITE_TOKEN_USDC,
        amount: '',
      },
    )

    setYouReceiver({
      token: props.currentTokenInfo.name,
      address: props.currentTokenInfo.address,
      amount: '0',
    })
  }

  return (
    <Modal afterClose={afterClose} {...props} footer={
      <Button
        type='primary'
        onClick={enterAnAmount}
        disabled={swaping}
        className='mt-5 h45 w-full'
      >
        {swapBnText}
      </Button>
    }>
      <div className='relative'>
        {/* 弹出swap界面 */}
        <h2>Swap</h2>
        <div className='h60 w-full flex items-center justify-between b-rd-6'>

          <span className='w120 flex items-center'>You will pay</span>
          <div className='w-auto flex items-center'>
            <Input value={youPay.amount} className='w-full' onChange={onSetYouPay} size='large' />
            <span className='mx-16 w50 flex items-center text-center'>{youPay.token}</span>
          </div>

        </div>
        <div className='mr-70 flex justify-end'>
          <button className='z-2 h47 w52 transform b-1px b-#424242 b-rd-6 b-solid bg-#141414 text-34 text-#fff transition-transform active:scale-98 hover:scale-102 !hover:c-pink'
            onClick={onSwap} >
            <SyncOutlined style={{ fontSize: '29px', cursor: 'pointer' }} />
          </button>
        </div>
        {/* <div className='h15'></div> */}
        <div className='h60 w-full flex items-center justify-between b-rd-6'>
          <span className='z-1 w120 flex items-center'>You will receive</span>
          <div className='flex items-center'>
            <Input value={youReceiver.amount} className='w-full' onChange={onSetYouReceiver} size='large' />
            <span className='mx-16 w50 flex items-center text-center'>{youReceiver.token}</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default SwapModal
