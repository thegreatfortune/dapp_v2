import Button from 'antd/es/button'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { message } from 'antd'
import useBrowserContract from '@/hooks/useBrowserContract'

const PersonalCenter = () => {
  const navigate = useNavigate()

  const { browserContractService } = useBrowserContract()

  const [loading, setLoading] = useState(false)

  const checkLoanOrderAndUserState = async () => {
    try {
      if (!browserContractService)
        return

      setLoading(true)
      const res = await browserContractService?.checkLatestOrderInProgress()

      const processCenterContract = await browserContractService?.getProcessCenterContract()

      const isBlack = await processCenterContract?._getIfBlackList(browserContractService?.getSigner.address)

      if (isBlack)
        message.error('You must be not black list to continue processing your order')

      !isBlack && res && navigate('/apply-loan')
    }
    catch (error) {
      message.error('Error: Order in processing')
      console.log('%c [ error ]-15', 'font-size:13px; background:#eccc7f; color:#ffffc3;', error)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button loading={loading} type="primary" onClick={checkLoanOrderAndUserState}>
        Apply for a loan
      </Button>

    </div>
  )
}

export default PersonalCenter
