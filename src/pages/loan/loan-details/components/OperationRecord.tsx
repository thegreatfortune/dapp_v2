import { useState } from 'react'
import BigNumber from 'bignumber.js'
import { useSearchParams } from 'react-router-dom'
import { Checkbox } from 'antd'
import { LoanTokenSwapService } from '../../../../.generated/api/LoanTokenSwap'
import ScrollableList from '@/pages/components/ScrollabletList'
import { Models } from '@/.generated/api/models'

const OperationRecord = () => {
  const [searchParams] = useSearchParams()
  const tradeId = searchParams.get('tradeId')

  const [params] = useState<Models.ApiLoanTokenSwapPageInfoGETParams>({ ...new Models.ApiLoanTokenSwapPageInfoGETParams(), ...{ limit: 8, page: 1 }, tradeId: Number(tradeId) })

  const renderItem = (item: Models.LoanTokenSwapVo) => {
    // Define the rendering logic for each item here
    return (
            <ul className='flex list-none gap-x-168'>
                <li>{item.createDate}</li>
                <li>USDC-{item.tokenAddr}</li>
                <li>{BigNumber(item.amount ?? 0).div(BigNumber(10).pow(18)).toFixed(2)}</li>
                {/* Add more properties based on your data structure */}
            </ul>
    )
  }

  return (
        <div>

          <Checkbox>Public</Checkbox>
          <Checkbox>Lender</Checkbox>
          <Checkbox>Room trade</Checkbox>

            <ul className='flex list-none gap-x-360'>
                <li>TIME</li>
                <li>Trading Pair</li>
                <li>Volume</li>
            </ul>

            <ScrollableList api={LoanTokenSwapService.ApiLoanTokenSwapPageInfo_GET} params={params} containerId='RoomTradeScrollable' renderItem={renderItem} />
        </div>
  )
}

export default OperationRecord