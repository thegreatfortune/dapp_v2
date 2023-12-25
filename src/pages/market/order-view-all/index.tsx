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

  const [apiParams, setApiParams] = useState({ ...new Models.ApiLoanPageLoanContractGETParams(), page: 1, limit: 10, borrowUserId: undefined })

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

        <Radio.Group defaultValue='All' onChange={e => fetchData(e.target.value)} className='w-453 flex'>
          <Radio.Button value="All" className='m-auto mr-20 h48 w-100 border-1px b-rd-6 text-center lh-48'>All</Radio.Button>
          <div className='border-3px b-transparent b-rd-0 from-[#0154fa] to-[#11b5dd] bg-gradient-to-r'>
          <Radio.Button value="LowRisk" className='m-auto h48 w146 b-rd-6 text-center lh-48'>🌈 LowRisk</Radio.Button>
          <Radio.Button value="HighRisk" className='m-auto ml-1 h48 w185 b-rd-6 text-center lh-48'>🎉 HighRisk</Radio.Button>
          </div>
        </Radio.Group>
      </div>
      <div className='h30 w-full'></div>

      {
        category === 'HotStarter'
      && <ScrollableList grid={{ gutter: 16, column: 4 }} api={LoanService.ApiLoanPageLoanContract_GET} params={{ ...apiParams, state: 'Following', orderItemList: 'actual_share_count=false' }} containerId='HotStarterContainer' renderItem={(item: Models.LoanOrderVO) => <div onClick={() => navigate(`/loan-details?prePage=market&tradeId=${item.tradeId}`)} ><TransparentCard key={item.tradeId} item={item} /></div>} />
      }

      {
        category === 'PopularToFollow'
      && <ScrollableList grid={{ gutter: 16, column: 4 }} api={LoanService.ApiLoanPageLoanContract_GET} params={{ ...apiParams, state: 'Trading,PaidOff,PaidButArrears,CloseByUncollected', orderItemList: 'total_market_trading_price=false' }} containerId='HotStarterContainer' renderItem={(item: Models.LoanOrderVO) => <div onClick={() => navigate(`/loan-details?prePage=market&tradeId=${item.tradeId}`)} > <TransparentCard key={item.tradeId} item={item} /></div> } />
      }

      {
        category === 'Blacklist'
      && <ScrollableList grid={{ gutter: 16, column: 4 }} api={LoanService.ApiLoanPageLoanContract_GET} params={{ ...apiParams, state: 'Blacklist' }} containerId='HotStarterContainer' renderItem={(item: Models.LoanOrderVO) => <div onClick={() => navigate(`/loan-details?prePage=market&tradeId=${item.tradeId}`)} className='grid grid-cols-4 w-full'><TransparentCard key={item.tradeId} item={item} /></div>} />
      }

    </div>
  )
}

export default OrderViewAll
