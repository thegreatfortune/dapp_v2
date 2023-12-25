import { Avatar, Button, Modal, Radio } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'
import { MarketService } from '../../.generated/api/Market'
import ScrollableList from '../components/ScrollabletList'
import { Models } from '@/.generated/api/models'
import marketBanner from '@/assets/images/market/banner.png'

const Trade = () => {
  const [params] = useState({ ...new Models.ApiMarketPageTradingLoanGETParams(), limit: 8, page: 1 })

  function fetchData(type?: string) {
    const params = { ...new Models.ApiMarketPageTradingLoanGETParams(), limit: 8, page: 1 }

    // if (type === 'LowRisk')
    //   params.tradingFormTypeList = 'SpotGoods'
    // else if (type === 'HighRisk')
    //   params.tradingFormTypeList = 'Contract,Empty'

    // setApiParams(params)
  }

  const navigate = useNavigate()

  const renderItem = (item: Models.MarketLoanVo) => {
    return (
      <div className='h125 w315 cursor-pointer s-container b-rd-6' onClick={() => navigate(`/loan-details/?prePage=trade&tradeId=${item.tradeId}`)}>
        <div className='flex'>
          <div className='ml-32 mt-20 h50 w50 b-rd-0'>
            <Avatar size={50} src={item.user?.pictureUrl}/>
          </div>
          <div className='grid'>
            <span className='c-fff ml-20 mt-22 h25 w-full text-20 font-400 lh-20'>michasi007{item.user?.nickName}</span>
            <span className='ml-20 h18 w-full text-14 font-400 lh-18 c-#999'>@Artist{item.user?.platformName}</span>
          </div>
        </div>
        <div className='flex justify-between'>
          <span className='ml-32 mt-20'> Price {ethers.formatUnits(String(item.price), BigInt(18))}</span>
          <span className='mr-29 mt-20'> Volume of business {item.totalTradingCompleted}</span>
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
          <Radio.Group value='All' className='w453 flex' onChange={e => fetchData(e.target.value)}>
            {/* <Radio.Button value="All" className='m-a h48 w100 items-center text-center text-18 font-500 lh-48 c-#fff'>All</Radio.Button> */}
            <button className='m-a h48 w100 items-center b-rd-4 text-center text-18 font-500 lh-48 c-#fff primary-btn'>All</button>
            <div className='ml-20 w333 flex justify-between b-2px b-#0980ed b-rd-4 b-solid'>
              <Radio.Button value="LowRisk" className='h48 w167 items-center text-18 font-500 lh-48'>🌈 Low Risk</Radio.Button>
              <div className='h45 w0 b-2px b-#0A80ED b-rd-0 b-solid'></div>
              <Radio.Button value="HighRisk" className='h48 w206 items-center text-18 font-500 lh-48'>🎉 High Risk</Radio.Button>
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
