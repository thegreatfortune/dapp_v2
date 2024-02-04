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

  const [activeKey, setActiveKey] = useState('All')

  const [category] = params.getAll('category')

  const { queryString } = useNavbarQueryStore()

  const navigate = useNavigate()

  const [apiParams, setApiParams] = useState({ ...new Models.ApiLoanPageLoanContractGETParams(), page: 1, limit: 16, borrowUserId: undefined })

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
    <div className='bg-center bg-no-repeat bg-origin-border'>
      <div className='h100 min-h-full w-full flex items-center justify-between'>
        <div className='flex items-center justify-between'>
          {title === 'Blacklist' && <Image src={blacklist1} preview={false} className='mr-5 h-50 w-50 pl-7 pr-10' />}
          <span className='ml-4 font-size-34'>
            {title}
          </span>
        </div>
        <Radio.Group defaultValue='All' onChange={e => fetchData(e.target.value)} className='w-453 flex' buttonStyle='solid'>
          <Radio.Button value="All" className='m-auto mr-20 h48 w-100 border-1px b-rd-6 text-center lh-48'>All</Radio.Button>
          {/* <Radio.Button value="All" className={`m-auto mr-20 h48 w-100 border-1px b-rd-6 text-center lh-48 ${activeKey === 'All' && 'bg-gradient-to-r from-[#0154fa] to-[#11b5dd]'}`}>All</Radio.Button> */}

          <Radio.Button value="LowRisk" className={`h48 w146 items-center text-18 font-500 lh-48  ${activeKey === 'LowRisk' && 'bg-gradient-to-r from-[#0154fa] to-[#11b5dd]'}`}>🌈 Low Risk</Radio.Button>
          <Radio.Button value="HighRisk" className={`h48 w185 items-center text-18 font-500 lh-48 ${activeKey === 'HighRisk' && 'bg-gradient-to-r from-[#0154fa] to-[#11b5dd]'}`}>🎉 High Risk</Radio.Button>
        </Radio.Group>
      </div>
      <div className='h60 w-full'></div>

      {
        category === 'HotStarter'
        && <ScrollableList
          // grid={{ gutter: 16, column: 4 }}
          grid={{ gutter: 16 }}
          api={LoanService.ApiLoanPageLoanContract_GET}
          params={{ ...apiParams, state: 'Following', orderItemList: 'actual_share_count=false' }}
          containerId='HotStarterContainer'
          renderItem={(item: Models.LoanOrderVO) => <div onClick={() => {
            navigate(`/loan-details?prePage=market&tradeId=${item.tradeId}`)
          }
          } ><TransparentCard key={item.tradeId} item={item} /></div>} />
      }

      {
        category === 'PopularToFollow'
        && <ScrollableList
          // grid={{ gutter: 16, column: 4 }}
          grid={{ gutter: 16 }}
          api={LoanService.ApiLoanPageLoanContract_GET}
          params={{ ...apiParams, state: 'Trading,PaidOff,PaidButArrears,CloseByUncollected', orderItemList: 'total_market_trading_price=false' }}
          containerId='PopularToFollow'
          renderItem={(item: Models.LoanOrderVO) =>
            <div onClick={() => {
              navigate(`/loan-details?prePage=market&tradeId=${item.tradeId}`)
            }} >
              <TransparentCard key={item.tradeId} item={item} />
            </div>
          }
        />
      }

      {
        category === 'Blacklist'
        && <ScrollableList grid={{ gutter: 16, column: 4 }} api={LoanService.ApiLoanPageLoanContract_GET} params={{ ...apiParams, state: 'Blacklist' }} containerId='HotStarterContainer' renderItem={(item: Models.LoanOrderVO) => <div onClick={() => navigate(`/loan-details?prePage=market&tradeId=${item.tradeId}`)} className='grid grid-cols-4 w-full'><TransparentCard key={item.tradeId} item={item} /></div>} />
      }

    </div >
  )
}

export default OrderViewAll
