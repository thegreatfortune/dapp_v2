import { useState } from 'react'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import { LoanService } from '@/.generated/api/Loan'
import ScrollableList from '@/pages/components/ScrollabletList'
import { Models } from '@/.generated/api/models'

interface IProps {
  tradeId: string
}

const LoanHistory: React.FC<IProps> = ({ tradeId }) => {
  const [params] = useState({
    ...new Models.ApiLoanPageLoanContractGETParams(),
    state: 'PaidOff,PaidButArrears,Blacklist',
    tradeId,
    limit: 10,
    page: 0,
  })

  const renderItem = (item: Models.LoanOrderVO, index: number) => {
    return (
      <ul className='grid grid-cols-6 h68 w-full list-none items-center gap-4 rounded-11 bg-#171822' key={item.tradeId}>
        <li className='relative'><span className='absolute left--22'>{index}</span>{item.collectEndTime && dayjs.unix(item.collectEndTime).format('YYYY-MM-DD HH:mm:ss')}</li>
        <li>${BigNumber(ethers.formatUnits(BigInt(item.loanMoney ?? 0))).toFixed(1)}</li>
        <li>{item.state === 'PaidButArrears' ? 'YES' : 'NO'}</li>
        <li>{item.periods} / {item.repayCount}</li>
        <li>555</li>
      </ul>
    )
  }

  return (<div>

    <span className='text-32 font-400'>Loan history</span>

    <ul className='grid grid-cols-5 list-none c-#666873'>
      <li>TIME</li>
      <li>Loan amount</li>
      <li>Debt status</li>
      <li>Loan period</li>
      <li>Amount due</li>
    </ul>

    <ScrollableList api={LoanService.ApiLoanPageLoanContract_GET} params={params} containerId='LoanHistoryScrollable' renderItem={renderItem} />
  </div>)
}

export default LoanHistory
