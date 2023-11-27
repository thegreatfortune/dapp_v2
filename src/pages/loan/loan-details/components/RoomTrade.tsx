import BigNumber from 'bignumber.js'
import { useState } from 'react'
import ScrollableRepaymentList from '@/pages/components/ScrollableRepaymentList '

const RoomTrade = () => {
  const [params] = useState({ limit: 10, page: 1 })

  const renderItem = (item: any) => {
    // Define the rendering logic for each item here
    return (
      <ul className='flex list-none gap-x-168'>
        <li>{item.nowCount} {item.repayTime}</li>
        <li>{BigNumber(item.repayFee ?? 0).div(BigNumber(10).pow(18)).toFixed(2)}</li>
        <li>{item.state}</li>
        {/* Add more properties based on your data structure */}
      </ul>
    )
  }

  return (
   <div>
    777
     {/* <ScrollableRepaymentList api={yourApiFunction} params={params} containerId='RoomTradeScrollable' renderItem={renderItem} /> */}
   </div>
  )
}

export default RoomTrade
