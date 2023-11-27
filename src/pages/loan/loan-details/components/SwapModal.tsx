import type { ModalProps } from 'antd'
import { Button, Input, Modal, message } from 'antd'
import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import type { CoinInfo } from './DesignatedPosition'
import useBrowserContract from '@/hooks/useBrowserContract'

interface IProps extends ModalProps {
  currentTokenInfo: CoinInfo
  tradeId: bigint | null
}

class SwapInfo {
  token: string | undefined
  address: string | undefined
  amount: string = '0'
}

const SwapModal: React.FC<IProps> = (props) => {
  const { browserContractService } = useBrowserContract()

  const [youPay, setYouPay] = useState<SwapInfo>({
    token: 'USDC',
    address: import.meta.env.VITE_USDC_TOKEN,
    amount: '0',
  })

  const [youReceiver, setYouReceiver] = useState<SwapInfo>({
    token: props.currentTokenInfo.name,
    address: props.currentTokenInfo.address,
    amount: '0',
  })

  const [ratio, setRatio] = useState<string>('0')

  useEffect(() => {
    async function fetchData() {
      if (!browserContractService || !props.currentTokenInfo.address)
        return

      const res = await browserContractService?.getTestLiquidityContract()
      const price = await res?.getTokenPrice(
        import.meta.env.VITE_USDC_TOKEN,
        props.currentTokenInfo.address,
        BigInt(3000),
        BigInt(100),
      )

      const newRatio = (Number(price) / 100).toFixed(5)
      setRatio(newRatio)

      setYouReceiver(prevReceiver => ({
        token: props.currentTokenInfo.name,
        address: props.currentTokenInfo.address,
        amount: BigNumber(youPay.amount).multipliedBy(newRatio).toString(),
      }))
    }

    fetchData()
  }, [browserContractService, props.currentTokenInfo])

  const onSetYouPay = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value.replace(/[^0-9.]/g, '')

    // Check if newAmount is a valid number
    const isValidNumber = !Number.isNaN(Number.parseFloat(newAmount)) && Number.isFinite(Number.parseFloat(newAmount))

    setYouPay({
      ...youPay,
      amount: isValidNumber ? newAmount : '0',
    })

    const calculatedAmount = BigNumber(isValidNumber ? newAmount : '0').multipliedBy(ratio).toString()
    setYouReceiver({
      ...youReceiver,
      amount: calculatedAmount,
    })
  }

  const onSetYouReceiver = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value.replace(/[^0-9.]/g, '')

    // Check if newAmount is a valid number
    const isValidNumber = !Number.isNaN(Number.parseFloat(newAmount)) && Number.isFinite(Number.parseFloat(newAmount))

    setYouReceiver({
      ...youReceiver,
      amount: isValidNumber ? newAmount : '0',
    })

    const calculatedAmount = BigNumber(isValidNumber ? newAmount : '0').dividedBy(ratio).toString()
    setYouPay({
      ...youPay,
      amount: calculatedAmount,
    })
  }

  const onSwap = () => {
    // Swap youPay and youReceiver information using BigNumber
    const tempYouPay = { ...youPay }
    const tempYouReceiver = { ...youReceiver }

    setYouPay({
      ...tempYouReceiver,
      amount: BigNumber(tempYouReceiver.amount).dividedBy(ratio).toString(),
    })

    setYouReceiver({
      ...tempYouPay,
      amount: BigNumber(tempYouPay.amount).multipliedBy(ratio).toString(),
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
    }
    else {
      buyOrSell = 1
      tokenInformation = youPay
    }

    if (!tokenInformation?.address) {
      message.error('address is undefined')
      return
    }

    const res = await browserContractService?.followHandle_swapERC20(props.tradeId, tokenInformation.address, BigInt(buyOrSell), ethers.parseEther(tokenInformation.amount))
    console.log('%c [ res ]-137', 'font-size:13px; background:#3d89bf; color:#81cdff;', res)
  }

  return (
    <Modal {...props} footer={
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
