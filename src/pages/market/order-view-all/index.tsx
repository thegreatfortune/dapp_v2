import { useParams, useSearchParams } from 'react-router-dom'
import CardsContainer from '@/pages/components/CardsContainer'

const OrderViewAll = () => {
  //   const { title } = useParams<{ title?: string }>()
  const [params] = useSearchParams()

  const [title] = params.getAll('title')
  return (
    <div className='min-h-full flex flex-col bg-center bg-no-repeat bg-origin-border'>
      <CardsContainer image='' key='sas' title={title} isViewAll={true} records={[
        {
          userId: 2023111400000006100,
          tradeId: 48,
          state: 'Following',
          tradingPlatform: 'Empty',
          tradingForm: 'Empty',
          loanMoney: 100000,
          interest: 500,
          repayCount: 0,
          periods: 5,
          goalCopies: 10000,
          minGoalQuantity: 1000,
          collectEndTime: 1700032756,
          dividendRatio: 8,

          createDate: '2023-11-14T15:33:14',
        },
      ]} />
      {/* <div className='h-600 w-full'>test</div> */}
    </div>
  )
}

export default OrderViewAll
