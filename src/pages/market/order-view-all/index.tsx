import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import CardsContainer from '@/pages/components/CardsContainer'
import { Models } from '@/.generated/api/models'
import { LoanService } from '@/.generated/api/Loan'
import useNavbarQueryStore from '@/store/useNavbarQueryStore'

const OrderViewAll = () => {
  //   const { title } = useParams<{ title?: string }>()
  const [params] = useSearchParams()

  const [title] = params.getAll('title')

  const [loanOrderVO, setLoanOrderVO] = useState<Models.LoanOrderVO[]>([])

  const { queryString } = useNavbarQueryStore()

  async function fetchData(type?: string) {
    const params = { ...new Models.ApiLoanPageLoanContractGETParams(), borrowUserId: undefined }
    params.limit = 8

    if (type === 'LowRisk')
      params.tradingFormTypeList = 'SpotGoods'
    else if (type === 'HighRisk')
      params.tradingFormTypeList = 'Contract,Empty'

    const res = await LoanService.ApiLoanPageLoanContract_GET(params)

    res?.records && setLoanOrderVO(res.records)
  }

  useEffect(() => {
    fetchData()
  }, [queryString])

  return (
    <div className='flex flex-col bg-center bg-no-repeat bg-origin-border'>
      <CardsContainer image='' key='sas' title={title} isViewAll={true} records={loanOrderVO} fetchData={fetchData} />
    </div>
  )
}

export default OrderViewAll
