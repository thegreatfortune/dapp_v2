import { Divider } from 'antd/lib'
import Radio from 'antd/es/radio'
import Button from 'antd/es/button'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { InputNumber, message } from 'antd'
import BigNumber from 'bignumber.js'
import InfoCard from './components/InfoCard'
import { LoanService } from '@/.generated/api/Loan'
import { Models } from '@/.generated/api/models'
import SModal from '@/pages/components/SModal'
import useBrowserContract from '@/hooks/useBrowserContract'

const LoanDetails = () => {
  const [searchParams] = useSearchParams()
  const tradeId = searchParams.get('tradeId')

  const navigate = useNavigate()

  const { browserContractService } = useBrowserContract()

  const [loanInfo, setLoanInfo] = useState(new Models.LoanOrderVO())

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [copies, setCopies] = useState<number | null>(1)

  const [lendState, setLendState] = useState<'Processing' | 'Success'>()

  useEffect(() => {
    async function fetchData() {
      if (tradeId) {
        const res = await LoanService.ApiLoanLoanInfo_GET({ tradeId: Number(tradeId) })

        setLoanInfo(preState => ({ ...preState, ...res }))
      }
    }
    fetchData()
  }, [tradeId])

  const handleOk = async () => {
    if (!tradeId || !copies)
      return

    setLendState('Processing')

    try {
      const RC20Contract = await browserContractService?.getERC20Contract()
      if (!browserContractService?.getSigner.address)
        return

      const cp = await browserContractService.getCapitalPoolAddress()

      if (!cp)
        return

      const approveRes = await RC20Contract?.approve(cp, BigInt(200 * 10 ** 6 * 10 ** 18))
      if (!approveRes)
        return

      const approveResult = await approveRes?.wait()
      if (approveResult?.status === 1) {
        const followCapitalPoolContract = await browserContractService?.getFollowCapitalPoolContract()
        const res = await followCapitalPoolContract?.lend(BigInt(copies), BigInt(tradeId))
        const result = await res?.wait()
        if (result?.status === 1) {
          setLendState('Success')

          navigate('/my-lend')
        }
      }
      else {
        message.error('授权失败')
        setLendState(undefined)
      }
    }
    catch (error) {
      console.log('%c [ error ]-42', 'font-size:13px; background:#6dfa68; color:#b1ffac;', error)
      setLendState(undefined)
    }
    finally {
      setIsModalOpen(false)
    }
  }

  return (<div className='w-full'>

    <SModal open={isModalOpen}
      maskClosable={false}
      onCancel={() => setIsModalOpen(false)}
      footer={lendState === 'Processing'
        ? null
        : [
        <Button key="submit" type="primary" onClick={() => handleOk()}>
          Follow
        </Button>,
        lendState === 'Success'
          ? null
          : <Button key="Cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          ]}
    >
      {
        !lendState
          ? <div>
            <h1>Share</h1>
            <div className='flex items-center justify-between'>
              <InputNumber
                value={copies}
                className='w-full'
                min={1}
                max={(loanInfo.goalCopies ?? 0) - (loanInfo.collectCopies ?? 0)}
                onChange={v => setCopies(v)}
              />
              <Button type='primary' onClick={() => setCopies((loanInfo.goalCopies ?? 0) - (loanInfo.collectCopies ?? 0))}>
                MAX
              </Button>
            </div>
          </div>
          : lendState === 'Processing'
            ? <h2>Processing.....</h2>
            : <div>
              <h2>Success</h2>
              {copies}Share
            </div>
      }
    </SModal>

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
          <Button className='h60 w180 primary-btn' onClick={() => setIsModalOpen(true)}>Follow</Button>
        </div>

        <p>
          Created with love，inspired by audio spectrum with abstract style so I re-created it in 3D
          software so it will look awesome, Visual done by bu.darmani 1 in High Definition size 2500X2500px.
        </p>

        <div className='h191 w1047 flex gap-x-24 border-5 border-#0394e8 border-solid'>

          <ul className='m0 list-none p0'>
            <li>Apply for loan</li>
            <li> {BigNumber(loanInfo.loanMoney ?? 0).div(10 ** 18).toFixed(18)} </li>
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
            <li> {loanInfo.tradingForm === 'SpotGoods' ? 'Low' : 'Hight'}</li>
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
