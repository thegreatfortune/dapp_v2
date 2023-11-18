import { Button } from 'antd'
import { useEffect, useState } from 'react'
import useBrowserContract from '@/hooks/useBrowserContract'

const MyLend = () => {
  const { browserContractService } = useBrowserContract()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!browserContractService)
      setLoading(true)
    else
      setLoading(false)
  }, [browserContractService])

  async function refund() {
    const res = await browserContractService?.capitalPool_Refund(BigInt(30))
    console.log('%c [ res ]-10', 'font-size:13px; background:#c0330e; color:#ff7752;', res)
  }

  async function approveHandle() {
    // Token USDC
    const res = await browserContractService?.capitalPool_ApproveHandle(BigInt(0), '0x0491eB796E0b7fEaA57f5ccEc5C202b8aAB84e7D')
    console.log('%c [ res ]-14', 'font-size:13px; background:#7b3b95; color:#bf7fd9;', res)
  }

  async function capitalPool_ClearingMoney() {
    const res = await browserContractService?.capitalPool_ClearingMoney('0xCfA09f923d29E41C4dCcb817A06D0BC3D73F6e1B', BigInt(30))
    console.log('%c [ res ]-30', 'font-size:13px; background:#172d6b; color:#5b71af;', res)
  }

  async function capitalPool_singleClearing() {
    const res = await browserContractService?.capitalPool_singleClearing(BigInt(34))
    console.log('%c [ res ]-34', 'font-size:13px; background:#2720d2; color:#6b64ff;', res)
  }

  async function capitalPool_Repay() {
    const res = await browserContractService?.capitalPool_Repay(BigInt(34))
    console.log('%c [ res ]-34', 'font-size:13px; background:#2720d2; color:#6b64ff;', res)
  }

  async function followHandle_SwapERC20() {
    const res = await browserContractService?.followHandle_SwapERC20(BigInt(0), '0xCfA09f923d29E41C4dCcb817A06D0BC3D73F6e1B', BigInt(0), BigInt(500000000))
    console.log('%c [ res ]-45', 'font-size:13px; background:#9d6543; color:#e1a987;', res)
  }

  return (

    <div>

      My Lend

      <div className='flex gap-x-24'>
        <Button loading={loading} onClick={refund}>refund</Button>

        <Button loading={loading} onClick={approveHandle}>approveHandle</Button>

        <Button loading={loading} onClick={capitalPool_ClearingMoney}>capitalPool_ClearingMoney</Button>

        <Button loading={loading} onClick={capitalPool_singleClearing}>capitalPool_singleClearing</Button>
        <Button loading={loading} onClick={capitalPool_Repay}>capitalPool_Repay</Button>
      </div>

    </div>
  )
}

export default MyLend
