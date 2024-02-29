import { useState } from 'react'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { LoanService } from '@/.generated/api/Loan'
import ScrollableList from '@/pages/components/ScrollabletList'
import { Models } from '@/.generated/api/models'
import useUserStore from '@/store/userStore'
import toCurrencyString from '@/utils/convertToCurrencyString'

interface IProps {
  tradeId: string
}

const LoanHistory: React.FC<IProps> = ({ tradeId }) => {
  const { currentUser } = useUserStore()
  const [params] = useState({
    ...new Models.ApiLoanPageLoanContractGETParams(),
    state: 'PaidOff,PaidButArrears,Blacklist',
    borrowUserId: currentUser.userId,
    tradeId,
    limit: 10,
    page: 0,
  })

  const renderItem = (item: Models.LoanOrderVO, index: number) => {
    return (
      <div className='w-full'>
        <div className='max-md:hidden'>
          <ul className='grid grid-cols-4 h68 w-full list-none items-center rounded-11 bg-#171822' key={item.tradeId}>
            {/* <li className='flex justify-center'>{index}</li> */}
            <li className=''>
              {/* <span className='absolute left--22'>
          </span> */}
              {index + 1}.  {item.collectEndTime && dayjs.unix(item.collectEndTime).format('YYYY-MM-DD HH:mm:ss')}
            </li>
            <li>$ {toCurrencyString(Number(ethers.formatUnits(BigInt(item.loanMoney ?? 0))))}</li>
            {/* <li className=''>${Number(Number(ethers.formatUnits(BigInt(item.loanMoney ?? 0))).toFixed(2)).toLocaleString()}</li> */}
            <li className=''>
              {item.state === 'PaidButArrears'
                ? <span className='text-16 text-red-500 font-extrabold'>Arrear</span>
                : <span className='text-green'>Paid Off</span>
              }
            </li>
            <li className=''>{item.repayCount} / {item.periods}</li>
            {/* <li className='flex justify-center'>{item.tradeId}</li> */}
          </ul>
        </div>
        <div className='md:hidden'>
          <div key={index} className='h-150 flex flex-col items-between border-2 border-#2d2f3d rounded-20 border-solid px-20 py-20 text-14'>
            {/* <ul className='h68 w-full list-none items-center rounded-11 bg-#171822'> */}
            <div className='my-4 flex grow justify-between text-15 font-bold'>
              <div>Time:</div>
              <div>{item.collectEndTime && dayjs.unix(item.collectEndTime).format('YYYY-MM-DD HH:mm:ss')}</div>
            </div>
            <div className='my-4 flex grow justify-between'>
              <div className='text-left'>Loan Amount:</div>
              <div className='text-right'>$ {toCurrencyString(Number(ethers.formatUnits(BigInt(item.loanMoney ?? 0))))}</div>
            </div>
            <div className='my-4 flex grow justify-between'>
              <div className='text-left'>Debt Status:</div>
              <div className='text-right'>{item.state === 'PaidButArrears'
                ? <span className='text-16 text-red-500 font-extrabold'>Arrear</span>
                : <span className='text-green'>Paid Off</span>
              }</div>
            </div>
            <div className='my-4 flex grow justify-between'>
              <div className='text-left'>Loan Period:</div>
              <div className='text-right'>{item.repayCount} / {item.periods}</div>
            </div>
          </div>
        </div>

      </div>
    )
  }

  return (<div>
    <span className='text-32 font-400'>Loan History</span>
    <div className='h-30'></div>
    <div className='max-md:hidden'>
      <ul className='grid grid-cols-4 list-none c-#666873'>
        {/* <li className='flex justify-center text-16'>SN</li> */}
        <li>Time</li>
        <li>Loan Amount</li>
        <li>Debt Status</li>
        <li>Loan Period</li>
        {/* <li className='flex justify-center text-18'>Amount Due</li> */}
      </ul>
      <ScrollableList
        api={LoanService.ApiLoanPageLoanContract_GET}
        params={params}
        containerId='LoanHistoryScrollable' renderItem={renderItem} />
    </div>
    <div className='md:hidden'>
      <ScrollableList
        api={LoanService.ApiLoanPageLoanContract_GET}
        params={params}
        containerId='LoanHistoryScrollable' renderItem={renderItem} grid={{ column: 1, gutter: 4 }} />
    </div>
  </div>)
}

export default LoanHistory
