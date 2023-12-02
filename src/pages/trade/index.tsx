import { Radio } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'
import { MarketService } from '../../.generated/api/Market'
import ScrollableList from '../components/ScrollabletList'
import { Models } from '@/.generated/api/models'

const Trade = () => {
  const navigate = useNavigate()

  const [params] = useState({ ...new Models.ApiMarketPageTradingLoanGETParams(), ...{ limit: 8, page: 1 } })

  const renderItem = (item: Models.MarketLoanVo) => {
    return (
      <div className='h125 w315 cursor-pointer s-container' onClick={() => navigate(`/loan-details/?prePage=trade&tradeId=${item.tradeId}`)}>
     <div className='flex justify-between'>
     <span> Price {ethers.formatUnits(String(item.price), BigInt(18))}</span>
        <span> Volume of business {item.totalTradingCompleted}</span>
     </div>
      </div>
    )
  }

  return (<div>
    <div className='h48 flex items-center justify-between'>
      <div>
        <h2 className='font-size-34'>
          title
        </h2>
      </div>

      <Radio.Group value='All' >
        <Radio.Button value="All">All</Radio.Button>
        <Radio.Button value="LowRisk">LowRisk</Radio.Button>
        <Radio.Button value="HighRisk">HighRisk</Radio.Button>
      </Radio.Group>

    </div>

    <div className='h23 w-full'></div>

     <ScrollableList api={MarketService.ApiMarketPageTradingLoan_GET} params={params} containerId='RoomTradeScrollable' renderItem={renderItem} />
  </div>)
}

export default Trade
