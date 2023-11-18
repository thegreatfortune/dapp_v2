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
    const res = await browserContractService?.capitalPool_Refund(BigInt(0))
    console.log('%c [ res ]-10', 'font-size:13px; background:#c0330e; color:#ff7752;', res)
  }

  async function approveHandle() {
    // Token USDC
    const res = await browserContractService?.capitalPool_ApproveHandle(BigInt(0), '0x0491eB796E0b7fEaA57f5ccEc5C202b8aAB84e7D')
    console.log('%c [ res ]-14', 'font-size:13px; background:#7b3b95; color:#bf7fd9;', res)
  }

  return (

    <div>

      My Lend

      <div className='flex gap-x-24'>
        <Button loading={loading} onClick={refund}>refund</Button>

        <Button loading={loading} onClick={approveHandle}>approveHandle</Button>
      </div>

    </div>
  )
}

export default MyLend
