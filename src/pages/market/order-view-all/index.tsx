import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Image, Radio } from 'antd'
import { Models } from '@/.generated/api/models'
import { LoanService } from '@/.generated/api/Loan'
import useNavbarQueryStore from '@/store/useNavbarQueryStore'
import TransparentCard from '@/pages/components/TransparentCard'
import ScrollableList from '@/pages/components/ScrollabletList'
import blacklist1 from '@/assets/images/market/blacklist1.png'

const OrderViewAll = () => {
  const [params] = useSearchParams()

  const [title] = params.getAll('title')

  const [category] = params.getAll('category')

  const { queryString } = useNavbarQueryStore()

  const navigate = useNavigate()

  const [apiParams, setApiParams] = useState({ ...new Models.ApiLoanPageLoanContractGETParams(), page: 1, limit: 8, borrowUserId: undefined })

  function fetchData(type?: string) {
    const params = { ...new Models.ApiLoanPageLoanContractGETParams(), page: 1, limit: 8, borrowUserId: undefined }
    if (title === 'Blacklist')
      params.state = 'Blacklist'

    if (type === 'LowRisk')
      params.tradingFormTypeList = 'SpotGoods'
    else if (type === 'HighRisk')
      params.tradingFormTypeList = 'Contract,Empty'

    setApiParams(params)
  }

  useEffect(() => {
    fetchData()
  }, [queryString])

  return (
    <div className='flex flex-col bg-center bg-no-repeat bg-origin-border'>
      <div className='h48 min-h-full flex items-center justify-between'>
        <div className='flex items-center justify-between'>
          {title === 'Blacklist' && <Image src={blacklist1} preview={false} className='mr-5 h-50 w-50 pl-7 pr-10' />}
          <span className='ml-4 font-size-34'>
            {title}
          </span>
        </div>

        <Radio.Group defaultValue='All' onChange={e => fetchData(e.target.value)}>
          <Radio.Button value="All">All</Radio.Button>
          <Radio.Button value="LowRisk">LowRisk</Radio.Button>
          <Radio.Button value="HighRisk">HighRisk</Radio.Button>
        </Radio.Group>
      </div>
      <div className='h30 w-full'></div>

      {
        category === 'HotStarter'
      && <ScrollableList grid={{ gutter: 16, column: 4 }} api={LoanService.ApiLoanPageLoanContract_GET} params={{ ...apiParams, state: 'Following', orderItemList: 'actual_share_count=false' }} containerId='HotStarterContainer' renderItem={(item: Models.LoanOrderVO) => <div onClick={() => navigate(`/loan-details?prePage=market&tradeId=${item.tradeId}`)} ><TransparentCard key={item.tradeId} item={item} /></div>} />
      }

      {
        category === 'PopularToFollow'
      && <ScrollableList grid={{ gutter: 16, column: 4 }} api={LoanService.ApiLoanPageLoanContract_GET} params={{ ...apiParams, orderItemList: 'total_market_trading_price=false' }} containerId='HotStarterContainer' renderItem={(item: Models.LoanOrderVO) => <div onClick={() => navigate(`/loan-details?prePage=market&tradeId=${item.tradeId}`)} > <TransparentCard key={item.tradeId} item={item} /></div> } />
      }

      {
        category === 'Blacklist'
      && <ScrollableList grid={{ gutter: 16, column: 4 }} api={LoanService.ApiLoanPageLoanContract_GET} params={{ ...apiParams, state: 'Blacklist' }} containerId='HotStarterContainer' renderItem={(item: Models.LoanOrderVO) => <div onClick={() => navigate(`/loan-details?prePage=market&tradeId=${item.tradeId}`)} className='grid grid-cols-4 w-full'><TransparentCard key={item.tradeId} item={item} /></div>} />
      }

    </div>
  )
}

export default OrderViewAll
