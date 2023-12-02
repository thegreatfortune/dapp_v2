import Button from 'antd/es/button'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { message } from 'antd'
import useBrowserContract from '@/hooks/useBrowserContract'

const PersonalCenter = () => {
  const navigate = useNavigate()

  const { browserContractService } = useBrowserContract()

  const [loading, setLoading] = useState(false)

  async function reSet() {
    try {
      // const cp = await browserContractService?.getCapitalPoolAddress(testTradeId)

      const followCapitalPoolContract
      = await browserContractService?.getCapitalPoolContract()
      console.log('%c [ followCapitalPoolContract ]-122', 'font-size:13px; background:#6485d8; color:#a8c9ff;', followCapitalPoolContract)

      await followCapitalPoolContract?.initCreateOrder()
    }
    catch (error) {
      console.log(
        '%c [ error ]-75',
        'font-size:13px; background:#69bdf3; color:#adffff;',
        error,
      )
    }
  }

  const checkLoanOrderAndUserState = async () => {
    try {
      if (!browserContractService)
        return

      setLoading(true)
      const isOrderCreated = await browserContractService?.getOrderCreateState()
      console.log('%c [ isOrderCreated ]-40', 'font-size:13px; background:#a23f4c; color:#e68390;', isOrderCreated)

      const processCenterContract = await browserContractService?.getProcessCenterContract()

      const isBlack = await processCenterContract?._getIfBlackList(browserContractService?.getSigner.address)
      console.log('%c [ isBlack ]-45', 'font-size:13px; background:#fde876; color:#ffffba;', isBlack)

      if (isBlack)
        message.error('You must be not black list to continue processing your order')

      if (!isBlack && !isOrderCreated)
        navigate('/apply-loan')
      else
        message.warning('order cant not repetition create')
    }
    catch (error) {
      message.error('Error: order status error')
      console.log('%c [ error ]-15', 'font-size:13px; background:#eccc7f; color:#ffffc3;', error)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-around'>

      <Button loading={loading} type="primary" onClick={checkLoanOrderAndUserState}>
        Apply for a loan
      </Button>

      <Button type="primary" onClick={reSet}>reSet</Button>

    </div>
  )
}

export default PersonalCenter
