import type { ModalProps } from 'antd'
import { Button, Input, Modal, message } from 'antd'
import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { tokenList } from '../../../../contract/tradingPairTokenMap'
import type { TokenInfo } from './Pool'
import useBrowserContract from '@/hooks/useBrowserContract'

interface IProps extends ModalProps {
  currentTokenInfo: TokenInfo
  tradeId: bigint | null
}

class SwapInfo {
  token: string | undefined
  address: string | undefined
  amount: string = ''
}

const SwapModal: React.FC<IProps> = (props) => {
  const { browserContractService } = useBrowserContract()

  const [youPay, setYouPay] = useState<SwapInfo>({
    token: 'USDC',
    address: import.meta.env.VITE_USDC_TOKEN,
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
        address: import.meta.env.VITE_USDC_TOKEN,
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

    let tokenInformation = new SwapInfo()

    let buyOrSell = 0 //  1为_token买入USDC操作,非1为卖出USDC换成_token

    if (youPay.token === 'USDC') {
      buyOrSell = 0
      tokenInformation = youReceiver
      tokenInformation.amount = youPay.amount
    }
    else {
      // const index = tokenList.findIndex(e => e.address === youPay.address)

      buyOrSell = 1
      // buyOrSell = index
      tokenInformation = youPay
    }

    if (!tokenInformation?.address) {
      message.error('address is undefined')
      return
    }

    console.log('%c [ tokenInformation ]-145', 'font-size:13px; background:#f054ad; color:#ff98f1;', tokenInformation)
    console.log('%c [ buyOrSell ]-154', 'font-size:13px; background:#0d14fd; color:#5158ff;', buyOrSell)

    // return

    const res = await browserContractService?.followRouter_doV3Swap(props.tradeId, tokenInformation.address, BigInt(buyOrSell), ethers.parseEther(tokenInformation.amount))
    console.log('%c [ doV3Swa ]-139', 'font-size:13px; background:#06b06f; color:#4af4b3;', res)
  }

  function afterClose() {
    setActiveInput('youPay')

    setYouPay(
      {
        token: 'USDC',
        address: import.meta.env.VITE_USDC_TOKEN,
        amount: '',
      },
    )

    setYouReceiver({
      token: props.currentTokenInfo.name,
      address: props.currentTokenInfo.address,
      amount: '',
    })
  }

  return (
    <Modal afterClose={afterClose} {...props} footer={
      <Button type='primary' onClick={enterAnAmount}>
        Enter an amount
      </Button>
    }>
      <div>
        <h2>swap</h2>
        <div className='flex'>
          <span>you pay</span>
          <Input value={youPay.amount} className='w-full' onChange={onSetYouPay} />
          <span>{youPay.token}</span>
        </div>
        <div className='h50'>
          <Button type='primary' onClick={onSwap}>
            箭头
          </Button>
        </div>
        <div className='flex'>
          <span>you receiver</span>
          <Input value={youReceiver.amount} className='w-full' onChange={onSetYouReceiver} />
          <span>{youReceiver.token}</span>
        </div>
      </div>
    </Modal>
  )
}

export default SwapModal
