import { Divider } from 'antd/lib'
import Radio from 'antd/es/radio'
import Button from 'antd/es/button'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import InfoCard from './components/InfoCard'
import { LoanService } from '@/.generated/api/Loan'
import { Models } from '@/.generated/api/models'

const LoanDetails = () => {
  const [searchParams] = useSearchParams()
  const tradeId = searchParams.get('tradeId')

  const [loanInfo, setLoanInfo] = useState(new Models.LoanOrderVO())

  useEffect(() => {
    async function fetchData() {
      if (tradeId) {
        const res = await LoanService.ApiLoanLoanInfo_GET({ tradeId: Number(tradeId) })

        setLoanInfo(preState => ({ ...preState, ...res }))
      }
    }

    fetchData()
  }, [tradeId])

  return (<div className='w-full'>

    <div className='flex'>
      <InfoCard />

      <div className='ml-32 h419 w1048'>

        <div className='flex justify-between'>
          <div>
            <div className='flex'>
              <Button className='mr-33'>Following</Button>
              <span> follow end time</span>
            </div>
            <div className='mb20 mt30'>  Sound Wave V!</div>

          </div>
          <Button>Follow</Button>
        </div>

        <p>
          Created with love，inspired by audio spectrum with abstract style so I re-created it in 3D
          software so it will look awesome, Visual done by bu.darmani 1 in High Definition size 2500X2500px.
        </p>

        <div className='h191 w1047 flex gap-x-24 border-5 border-#0394e8 border-solid'>

          <ul className='m0 list-none p0'>
            <li>Apply for loan</li>
            <li>{loanInfo.loanMoney}</li>
            <li>USDC</li>
          </ul>

          <Divider type='vertical' className='box-border h-full bg-#fff' />

          <ul className='m0 list-none p0'>
            <li>Cycle(day)/Periodn</li>
            <li>{loanInfo.periods} / {loanInfo.collectEndTime}</li>
          </ul>

          <ul className='m0 list-none p0'>
            <li>Interest</li>
            <li>{loanInfo.interest}</li>
          </ul>

          <ul className='m0 list-none p0'>
            <li>dividend</li>
            <li>{loanInfo.dividendRatio}</li>
          </ul>

          <ul className='m0 list-none p0'>
            <li>Risk level</li>
            <li> {loanInfo.tradingForm === 'SpotGoods' ? 'Low' : 'Hight' }</li>
          </ul>

          <ul className='m0 list-none p0'>
            <li>Number of copies</li>
            <li>{loanInfo.goalCopies}</li>
          </ul>

          <ul className='m0 list-none p0'>
            <li>Purchased copies</li>
            <li>loanInfo Purchased</li>
          </ul>

        </div>

      </div>
    </div>

    <Radio.Group value='large' >
      <Radio.Button value="large">Designated Position</Radio.Button>
      <Radio.Button value="default">Operation record</Radio.Button>
      <Radio.Button value="small">Room trade</Radio.Button>
    </Radio.Group>

  </div>)
}

export default LoanDetails
