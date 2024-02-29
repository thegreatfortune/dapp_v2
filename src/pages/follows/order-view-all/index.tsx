import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Image, Radio } from 'antd'
import { InfoCircleOutlined, WarningOutlined } from '@ant-design/icons'
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
      <div className='page-title-box'>
        <div className='my-20'>
          {title === 'Blacklist' && <Image src={blacklist1} preview={false} className='mr-5 h-50 w-50 pl-7 pr-10' />}
          <span className='page-title'>
            {title}
          </span>
        </div>
        <div className='my-20'>
          <Radio.Group defaultValue='All' onChange={e => fetchData(e.target.value)} className='flex' buttonStyle='solid'>
            <Radio.Button
              value="All"
              className='radio-btn-all'>
              All
            </Radio.Button>
            <Radio.Button
              value="LowRisk"
              className={`radio-btn-other ${activeKey === 'LowRisk' && 'bg-gradient-to-r from-[#0154fa] to-[#11b5dd]'}`}>
              <div className='flex justify-center'>
                <InfoCircleOutlined className='mr-4 text-slate-500' />Low Risk
              </div>
            </Radio.Button>
            <Radio.Button
              value="HighRisk"
              // className={`h40 w140 items-center lh-40 ${activeKey === 'HighRisk' && 'bg-gradient-to-r from-[#0154fa] to-[#11b5dd]'}`}>
              className={`radio-btn-other ${activeKey === 'HighRisk' && 'bg-gradient-to-r from-[#0154fa] to-[#11b5dd]'}`}>
              <div className='flex justify-center'>
                <WarningOutlined className='mr-4 text-red-500' /> High Risk
              </div>
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <div className='h60 w-full'></div>

      {
        category === 'TrendingLoans'
        && <ScrollableList
          // grid={{ gutter: 16, column: 4 }}
          grid={{ gutter: 16 }}
          api={LoanService.ApiLoanPageLoanContract_GET}
          params={{ ...apiParams, state: 'Following', orderItemList: 'actual_share_count=false' }}
          containerId='TrendingLoansContainer'
          renderItem={(item: Models.LoanOrderVO) => <div onClick={() => {
            navigate(`/loan-details?prePage=market&tradeId=${item.tradeId}`)
          }
          } ><TransparentCard key={item.tradeId} item={item} /></div>} />
      }

      {
        category === 'AllLoans'
        && <ScrollableList
          // grid={{ gutter: 16, column: 4 }}
          grid={{ gutter: 12 }}
          api={LoanService.ApiLoanPageLoanContract_GET}
          params={{ ...apiParams, state: 'Trading,PaidOff,PaidButArrears,CloseByUncollected', orderItemList: 'total_market_trading_price=false' }}
          containerId='AllLoansContainer'
          renderItem={(item: Models.LoanOrderVO) =>
            <div className="my-10 flex grow justify-center" onClick={() => {
              navigate(`/loan-details?prePage=market&tradeId=${item.tradeId}`)
            }} >
              <TransparentCard key={item.tradeId} item={item} />
            </div>
          }
        />
      }

      {
        category === 'Blacklist'
        && <ScrollableList grid={{ gutter: 16, column: 4 }} api={LoanService.ApiLoanPageLoanContract_GET} params={{ ...apiParams, state: 'Blacklist' }} containerId='TrendingLoansContainer' renderItem={(item: Models.LoanOrderVO) => <div onClick={() => navigate(`/loan-details?prePage=market&tradeId=${item.tradeId}`)} className='grid grid-cols-4 w-full'><TransparentCard key={item.tradeId} item={item} /></div>} />
      }

    </div >
  )
}

export default OrderViewAll
