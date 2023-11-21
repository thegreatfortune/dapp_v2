import { Button, Input, InputNumber } from 'antd'
import { useEffect, useState } from 'react'
import useBrowserContract from '@/hooks/useBrowserContract'

const Test = () => {
  const { browserContractService } = useBrowserContract()

  const [loading, setLoading] = useState(false)

  const [tradeId, setTradeId] = useState<bigint>(BigInt(0))

  useEffect(() => {
    if (!browserContractService)
      setLoading(true)
    else
      setLoading(false)
  }, [browserContractService])

  function inputChange(v: number | null) {
    if (!v)
      return

    setTradeId(BigInt(v))
  }

  async function refund() {
    const res = await browserContractService?.capitalPool_refund(tradeId)
    console.log('%c [ res ]-10', 'font-size:13px; background:#c0330e; color:#ff7752;', res)
  }

  async function approveHandle() {
    // Token USDC
    const res = await browserContractService?.capitalPool_approveHandle(tradeId, '0x0491eB796E0b7fEaA57f5ccEc5C202b8aAB84e7D')
    console.log('%c [ res ]-14', 'font-size:13px; background:#7b3b95; color:#bf7fd9;', res)
  }

  async function capitalPool_ClearingMoney() {
    const res = await browserContractService?.capitalPool_clearingMoney('0xCfA09f923d29E41C4dCcb817A06D0BC3D73F6e1B', tradeId)
    console.log('%c [ res ]-30', 'font-size:13px; background:#172d6b; color:#5b71af;', res)
  }

  async function capitalPool_singleClearing() {
    const res = await browserContractService?.capitalPool_singleClearing(tradeId)
    console.log('%c [ res ]-34', 'font-size:13px; background:#2720d2; color:#6b64ff;', res)
  }

  async function capitalPool_Repay() {
    const res = await browserContractService?.capitalPool_repay(tradeId)
    console.log('%c [ res ]-34', 'font-size:13px; background:#2720d2; color:#6b64ff;', res)
  }

  async function followHandle_SwapERC20() {
    const res = await browserContractService?.followHandle_swapERC20(tradeId, '0xCfA09f923d29E41C4dCcb817A06D0BC3D73F6e1B', BigInt(0), BigInt(500000000))
    console.log('%c [ res ]-45', 'font-size:13px; background:#9d6543; color:#e1a987;', res)
  }

  async function followRefundPool_lenderWithdraw() {
    const res = await browserContractService?.followRefundPool_lenderWithdraw(tradeId)
    console.log('%c [ res ]-45', 'font-size:13px; background:#9d6543; color:#e1a987;', res)
  }

  async function followRefundPool_borrowerWithdraw() {
    const res = await browserContractService?.followRefundPool_borrowerWithdraw(tradeId)
    console.log('%c [ res ]-45', 'font-size:13px; background:#9d6543; color:#e1a987;', res)
  }

  return (

    <div>
      Test

      订单id: {Number(tradeId)} <InputNumber onChange={inputChange} className='w-200' />

      <div className='h20'></div>

      <div className='flex flex-wrap gap-24'>

        <Button loading={loading} onClick={refund}> 贷款人退款  refund</Button>

        <Button loading={loading} onClick={approveHandle}> 资金池授权handle approveHandle</Button>

        <Button loading={loading} onClick={capitalPool_ClearingMoney}>清算其余资产  capitalPool_ClearingMoney</Button>

        <Button loading={loading} onClick={capitalPool_singleClearing}> 一次性还款清算 capitalPool_singleClearing</Button>

        <Button loading={loading} onClick={capitalPool_Repay}>借款人偿还欠款 capitalPool_Repay</Button>

        <Button loading={loading} onClick={followHandle_SwapERC20}> swap操作 followHandle_SwapERC20</Button>

        <Button loading={loading} onClick={followRefundPool_lenderWithdraw}> 贷款人提取最后清算的资金+还款资金+分红资金 followRefundPool_lenderWithdraw</Button>

        <Button loading={loading} onClick={followRefundPool_borrowerWithdraw}> 借款人提取 followRefundPool_borrowerWithdraw</Button>
      </div>

    </div>
  )
}

export default Test
