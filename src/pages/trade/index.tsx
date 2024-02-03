import { Avatar, Radio } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'
import { MarketService } from '../../.generated/api/Market'
import ScrollableList from '../components/ScrollabletList'
import { Models } from '@/.generated/api/models'
import marketBanner from '@/assets/images/market/banner.png'
import { isContractAddress } from '@/utils/regex'
import { maskWeb3Address } from '@/utils/maskWeb3Address'
import logo from '@/assets/images/portalImages/logo.png'

const Trade = () => {
  const [params, setParams] = useState({ ...new Models.ApiMarketPageTradingLoanGETParams(), limit: 8, page: 1 })

  const [activeKey, setActiveKey] = useState('All')

  function fetchData(type?: string) {
    setActiveKey(type ?? 'All')

    const params = { ...new Models.ApiMarketPageTradingLoanGETParams(), limit: 8, page: 1 }

    if (type === 'LowRisk')
      params.tradingFormTypeStr = 'SpotGoods'
    else if (type === 'HighRisk')
      params.tradingFormTypeStr = 'Contract,Empty'
    setParams(params)
  }

  const navigate = useNavigate()

  const renderItem = (item: Models.MarketLoanVo) => {
    return (
      <div className='s-container box-border h125 w315 cursor-pointer border-2 border-#303241 b-rd-6 rounded-16 border-solid bg-[#171822]'
        onClick={() => navigate(`/loan-details/?prePage=trade&tradeId=${item.tradeId}`)}>
        <div className='mt-20 flex justify-between'>
          <div className='ml-32 h50 w50 b-rd-0'>
            <Avatar className='bg-slate-200' size={50} src={item.user?.pictureUrl ? item.user?.pictureUrl : logo} />
          </div>
          <div className='grid mr-32 mt-5'>
            <span className='c-fff h25 w-full text-20 font-400 lh-20'>{isContractAddress(item.user?.nickName ?? '') ? maskWeb3Address(item.user?.nickName ?? '') : (item.user?.nickName ?? 'not bound')}</span>
            <span className='h18 w-full text-14 font-400 lh-18 c-#999'>@{item.user?.platformName ?? 'not bound'}</span>
          </div>
        </div>
        <div className='flex justify-between'>
          <span className='ml-32 mt-20'> Volume: {item.totalTradingCompleted}</span>
          <span className='mr-32 mt-18 text-16'> Price: {ethers.formatUnits(String(item.price), BigInt(18))}</span>
        </div>
      </div>
    )
  }

  return (
    <div className='m-auto'>
      <img src={marketBanner} alt="" className='m-auto h280 w-full b-rd-20 object-cover' />
      <div className='h80 w-full'></div>
      <div>
        <div className='h48 flex items-center justify-between'>
          <div>
            <h2 className='font-size-34'>
              🔥 Hot
            </h2>
          </div>
          <Radio.Group defaultValue='All' className='w453 flex' onChange={e => fetchData(e.target.value)} buttonStyle='solid'>
            {/* <Radio.Button value="All" className='m-a h48 w100 items-center text-center text-18 font-500 lh-48 c-#fff'>All</Radio.Button> */}
            <Radio.Button className={`m-a h48 w100 items-center b-rd-4 text-center text-18 font-500 lh-48 c-#fff ${activeKey === 'All' && 'primary-btn'}`}>All</Radio.Button>
            <div className='ml-20 w333 flex justify-between b-#0980ed'>
              <Radio.Button value="LowRisk" className={`h48 w167 items-center text-18 font-500 lh-48 ${activeKey === 'LowRisk' && 'bg-gradient-to-r from-[#0154fa] to-[#11b5dd]'}`}>🌈 Low Risk</Radio.Button>
              <div className='h45 w0 b-1px b-#0A80ED b-rd-0 b-solid'></div>
              <Radio.Button value="HighRisk" className={`h48 w206 items-center text-18 font-500 lh-48 ${activeKey === 'HighRisk' && 'bg-gradient-to-r from-[#0154fa] to-[#11b5dd]'}`}>🎉 High Risk</Radio.Button>
            </div>
          </Radio.Group>
        </div>

        <div className='h23 w-full'></div>

        <ScrollableList grid={{ gutter: 16, column: 4 }} api={MarketService.ApiMarketPageTradingLoan_GET} params={params} containerId='TradeScrollable' renderItem={renderItem} />
      </div>
    </div>
  )
}

export default Trade
