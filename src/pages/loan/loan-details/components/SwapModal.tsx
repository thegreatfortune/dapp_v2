import type { ModalProps } from 'antd'
import { Button, Image, Input, Modal, message } from 'antd'
import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { RetweetOutlined } from '@ant-design/icons'
import { tokenList } from '../../../../contract/tradingPairTokenMap'
import type { TokenInfo } from './Pool'
import useBrowserContract from '@/hooks/useBrowserContract'

// import exChange from '@/assets/images/loan-details/exchange.png'
import FolCoin from '@/assets/images/loan-details/FolCoin.png'

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

    let buyOrSell = 0

    if (youPay.token === 'USDC') {
      buyOrSell = 0
      tokenInformation = youReceiver
      tokenInformation.amount = youPay.amount
    }
    else {
      const index = tokenList.findIndex(e => e.address === youPay.address)

      buyOrSell = index
      tokenInformation = youPay
    }

    if (!tokenInformation?.address) {
      message.error('address is undefined')
      return
    }

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
      <div className='relative h-360'>
        <div className='flex justify-between'>
          <h2 className='c-#fff'>SWAP</h2>
          <div className='flex'>
            <h2 className='ml-15 c-#373749'>Follow</h2>
            <img src={FolCoin} alt="" className='mt-23 h25 w25 opacity-50' />
          </div>
        </div>
        <div className='z-1 h125 w-full b-rd-6'>
          <span className='ml-5 mt-20 text-14'>you pay</span>
          <div className='flex'>
            <Input disabled={youPay.token !== 'USDC'} value={youPay.amount} className='ml-2 mt-20 h50 w-431 text-15 text-#fff' onChange={onSetYouPay} />
            <span className='m-auto ml-5 mt-32 text-center'>{youPay.token}</span>
          </div>
        </div>
        <div className='absolute left-206 right-50% top-50% z-2 h40 w-full'>
          <div className='z-3 h40 w40 transform border-1 b-gray b-rd-6 b-solid c-#fff'>
            <RetweetOutlined onClick={onSwap} twoToneColor="#eb2f96" style={{ fontSize: '40px', margin: 'auto', color: '#08c', width: '40px', position: 'absolute' }} className='absolute z-2 m-auto transform transition-transform active:scale-95 hover:scale-105 !hover:c-pink' />
          </div>
        </div>
        {/* <div className='m-auto h40 w-472 transform b-rd-6 from-[#0154fa] to-[#11b5dd] bg-gradient-to-r text-center text-20 font-700 transition-transform active:scale-99 hover:scale-101 !hover:c-pink' onClick={onSwap}>↑↓Exchange</div> */}
        <div className='relative z-1 h10 w-full'></div>
        <div className='z-1 h125 w-full b-rd-6'>
          <span className='ml-5 text-14'>you receiver</span>
          <div className='flex'>
            <Input disabled={youReceiver.token !== 'USDC'} value={youReceiver.amount} className='ml-2 mt-20 h50 w-431 text-15 text-#fff' onChange={onSetYouReceiver} />
            <span className='m-auto ml-5 mt-32 text-center'>{youReceiver.token}</span>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default SwapModal
