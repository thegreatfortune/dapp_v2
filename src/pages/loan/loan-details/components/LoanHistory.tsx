import { useState } from 'react'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import { LoanService } from '@/.generated/api/Loan'
import ScrollableList from '@/pages/components/ScrollabletList'
import { Models } from '@/.generated/api/models'
import useUserStore from '@/store/userStore'

interface IProps {
  tradeId: string
}

const LoanHistory: React.FC<IProps> = ({ tradeId }) => {
  const { activeUser } = useUserStore()
  const [params] = useState({
    ...new Models.ApiLoanPageLoanContractGETParams(),
    state: 'PaidOff,PaidButArrears,Blacklist',
    borrowUserId: activeUser.userId,
    tradeId,
    limit: 10,
    page: 0,
  })

  const renderItem = (item: Models.LoanOrderVO, index: number) => {
    return (
      <ul className='grid grid-cols-5 h68 w-full items-center gap-10 rounded-11 bg-#171822 ps-0' key={item.tradeId}>
        {/* <li className='flex justify-center'>{index}</li> */}
        <li className='flex justify-center'><span className='absolute left--22'>
        </span>{index + 1}.  {item.collectEndTime && dayjs.unix(item.collectEndTime).format('YYYY-MM-DD HH:mm:ss')}
        </li>
        <li className='flex justify-center'>${BigNumber(ethers.formatUnits(BigInt(item.loanMoney ?? 0))).toFixed(1)}</li>
        <li className='flex justify-center'>
          {item.state === 'PaidButArrears'
            ? <span className='text-20 font-extrabold text-red-500'>Arrear</span>
            : <span className='text-green'>Paid Off</span>
          }
        </li>
        <li className='flex justify-center'>{item.repayCount} / {item.periods}</li>
        <li className='flex justify-center'>555</li>
      </ul>
    )
  }

  return (<div>

    <span className='text-32 font-400'>Loan History</span>

    <ul className='grid grid-cols-5 gap-10 ps-0'>
      {/* <li className='flex justify-center text-16'>SN</li> */}
      <li className='flex justify-center text-18'>Time</li>
      <li className='flex justify-center text-18'>Loan Amount</li>
      <li className='flex justify-center text-18'>Debt Status</li>
      <li className='flex justify-center text-18'>Loan Period</li>
      <li className='flex justify-center text-18'>Amount Due</li>
    </ul>
    <ScrollableList api={LoanService.ApiLoanPageLoanContract_GET} params={params} containerId='LoanHistoryScrollable' renderItem={renderItem} />
  </div>)
}

export default LoanHistory
