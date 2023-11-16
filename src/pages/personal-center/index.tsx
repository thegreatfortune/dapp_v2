import Button from 'antd/es/button'
import { useNavigate } from 'react-router-dom'
import useBrowserContract from '@/hooks/useBrowserContract'

// TODO 检查 订单状态 黑名单检查
const PersonalCenter = () => {
  const navigate = useNavigate()

  const { browserContractService } = useBrowserContract()

  const checkLoanOrderAndUserState = async () => {
    try {
      // console.log('%c [ browserContractService ]-14', 'font-size:13px; background:#839a06; color:#c7de4a;', browserContractService)
      // const followManageContract = await browserContractService?.getFollowManageContract()
      // console.log('%c [ followManageContract ]-15', 'font-size:13px; background:#6eb443; color:#b2f887;', followManageContract)

      // followManageContract?.getborrowerAllOrdersId('', 'sa')

      // const followCapitalPoolContract = await browserContractService?.getFollowCapitalPoolContract()

      // followCapitalPoolContract?.getList()

      navigate('/apply-loan')
    }
    catch (error) {
      console.log('%c [ error ]-15', 'font-size:13px; background:#eccc7f; color:#ffffc3;', error)
    }
  }

  return (
    <div>
      <Button type="primary" onClick={checkLoanOrderAndUserState}>
        Apply for a loan
      </Button>

    </div>
  )
}

export default PersonalCenter
