import type { ModalProps } from 'antd'
import { Button, InputNumber, Modal } from 'antd'
import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import type { CoinInfo } from './DesignatedPosition'
import useBrowserContract from '@/hooks/useBrowserContract'

interface IProps extends ModalProps {
  currentTokenInfo: CoinInfo
}

class SwapInfo {
  token: string | undefined
  address: string | undefined
  amount: number = 0
}

const SwapModal: React.FC<IProps> = (props) => {
  const { browserContractService } = useBrowserContract()

  const [youPay, setYouPay] = useState<SwapInfo>({
    token: 'USDC',
    address: import.meta.env.VITE_USDC_TOKEN,
    amount: 0,
  })

  const [youReceiver, setYouReceiver] = useState<SwapInfo>({
    token: props.currentTokenInfo.name,
    address: props.currentTokenInfo.address,
    amount: 0,
  })
  const [ratio, setRatio,
  ] = useState<string>('')

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

      setYouReceiver(() => ({
        token: props.currentTokenInfo.name,
        address: props.currentTokenInfo.address,
        amount: BigNumber(youPay.amount).multipliedBy(ratio).toNumber(),
      }))
    }
    fetchData()
  }, [browserContractService, props.currentTokenInfo])

  useEffect(() => {
    setYouReceiver(prevReceiver => ({
      ...prevReceiver,
      amount: BigNumber(youPay.amount).multipliedBy(ratio).toNumber(),
    }))
  }, [youPay, ratio])

  //   useEffect(() => {
  //     setYouPay(prevYouPay => ({
  //       ...prevYouPay,
  //       amount: BigNumber(youReceiver.amount).dividedBy(ratio).toNumber(),
  //     }))
  //   }, [youReceiver, ratio])

  function onSetYouPay(v: number | null) {
    setYouPay(prevYouPay => ({
      ...prevYouPay,
      amount: v ?? 0,
    }))
  }

  function onSetYouReceiver(v: number | null) {
    setYouReceiver(prevYouReceiver => ({
      ...prevYouReceiver,
      amount: v ?? 0,
    }))
  }

  return (
    <Modal {...props}>
      <div>
        <h2>swap</h2>
        <div className='flex'>
          <span>you pay</span>
          <InputNumber value={youPay.amount} className='w-full' onChange={v => onSetYouPay(v)} />
          <span>USDC</span>
        </div>
        <div className='h50'>
          <Button type='primary'>downward</Button>
        </div>
        <div className='flex'>
          <span>you receiver</span>
          <InputNumber
            value={youReceiver.amount}
            className='w-full'
            onChange={v => onSetYouReceiver(v)}
          />
          <span>{props.currentTokenInfo.name}</span>
        </div>
      </div>
    </Modal>
  )
}

export default SwapModal
