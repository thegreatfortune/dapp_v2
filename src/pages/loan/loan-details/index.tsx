import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button, Divider, InputNumber, Radio, message } from 'antd'
import BigNumber from 'bignumber.js'
import InfoCard from './components/InfoCard'
import Countdown from './components/Countdown'
import DesignatedPosition from './components/DesignatedPosition'
import { LoanService } from '@/.generated/api/Loan'
import { Models } from '@/.generated/api/models'
import SModal from '@/pages/components/SModal'
import useBrowserContract from '@/hooks/useBrowserContract'

const LoanDetails = () => {
  const [searchParams] = useSearchParams()
  const tradeId = searchParams.get('tradeId')

  const prePage = searchParams.get('prePage')

  const navigate = useNavigate()

  const { browserContractService } = useBrowserContract()

  const [loanInfo, setLoanInfo] = useState(new Models.LoanOrderVO())

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [extractIsModalOpen, setExtractIsModalOpen] = useState(false)
  const [extraModalLoading, setExtraModalLoading] = useState(false)

  const [copies, setCopies] = useState<number | null>(1)

  const [lendState, setLendState] = useState<'Processing' | 'Success'>()

  const [checkMaxLoading, setCheckMaxLoading] = useState(false)

  const [refundPoolAddress, setRefundPoolAddress] = useState<string>()

  useEffect(() => {
    async function fetchData() {
      if (!tradeId || !browserContractService)
        return

      const address = await browserContractService?.getRefundPoolAddress(BigInt(tradeId))

      setRefundPoolAddress(address)
    }

    fetchData()
  }, [browserContractService, tradeId])

  useEffect(() => {
    async function fetchData() {
      if (tradeId) {
        const res = await LoanService.ApiLoanLoanInfo_GET({ tradeId: Number(tradeId) })

        setLoanInfo(preState => ({ ...preState, ...res }))
      }
    }
    fetchData()
  }, [tradeId])

  useEffect(() => {
    async function checkMax() {
      if (!tradeId || !checkMaxLoading)
        return

      try {
        const followCapitalPoolContract = await browserContractService?.getCapitalPoolContractByTradeId(BigInt(tradeId))

        const res = await followCapitalPoolContract?.getList(tradeId)

        if (res) {
          const copies = Number(BigInt(res[7])) - Number(BigInt(res[9]))
          setCopies(copies)
        }
      }
      catch (error) {
        console.log('%c [ error ]-107', 'font-size:13px; background:#64ed0c; color:#a8ff50;', error)
      }
      finally {
        setCheckMaxLoading(false)
      }
    }
    checkMax()
  }, [checkMaxLoading])

  async function extractConfirm() {
    if (!tradeId)
      return

    setExtraModalLoading(true)

    try {
      await browserContractService?.refundPool_borrowerWithdraw(BigInt(tradeId))
    }
    catch (error) {
      console.log('%c [ error ]-91', 'font-size:13px; background:#f09395; color:#ffd7d9;', error)
    }
    finally {
      setExtraModalLoading(false)
    }
  }

  const handleOk = async () => {
    if (!tradeId || !copies)
      return

    setLendState('Processing')

    try {
      if (!browserContractService?.getSigner.address)
        return

      const ERC20Contract = await browserContractService?.getERC20Contract()

      const followManageContract = await browserContractService?.getFollowManageContract()

      const cp = await followManageContract?.getTradeIdToCapitalPool(BigInt(tradeId))

      console.log('%c [ cp ]-60', 'font-size:13px; background:#8ef2e0; color:#d2ffff;', cp)

      if (!cp)
        return

      const allowance = await ERC20Contract?.allowance(cp, browserContractService?.getSigner.address)
      console.log('%c [ allowance ]-67', 'font-size:13px; background:#ffc377; color:#ffffbb;', allowance)

      if ((allowance ?? BigInt(0)) <= BigInt(0)) {
        const approveRes = await ERC20Contract?.approve(cp, BigInt(200 * 10 ** 6) * BigInt(10 ** 18))
        if (!approveRes)
          return

        const approveResult = await approveRes?.wait()

        if (approveResult?.status !== 1) {
          message.error('operation failure')
          setLendState(undefined)
          return
        }
      }

      const result = await browserContractService.capitalPool_lend(BigInt(copies), BigInt(tradeId))
      console.log('%c [ result ]-114', 'font-size:13px; background:#b71c0a; color:#fb604e;', result)

      if (result?.status === 1)
        setLendState('Success')
      else
        message.error('operation failure')
    }
    catch (error) {
      message.error('operation failure')
      setLendState(undefined)
      console.log('%c [ error ]-87', 'font-size:13px; background:#90ef5a; color:#d4ff9e;', error)
    }
  }

  async function onSetMax() {
    setCheckMaxLoading(true)
  }

  function confirmLend() {
    navigate('/my-lend')
    setIsModalOpen(false)
    setLendState(undefined)
  }

  return (<div className='w-full'>

    <SModal open={extractIsModalOpen}
      maskClosable={false}
      onCancel={() => setExtractIsModalOpen(false)}
      footer={[<Button key="submit" loading={extraModalLoading} type="primary" onClick={() => extractConfirm()}>
        confirm
      </Button>,
      <Button key="Cancel" onClick={() => setExtractIsModalOpen(false)}>
        Cancel
      </Button>,
      ]}
    >
      <div>
        extract
      </div>
    </SModal>

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
                onChange={v => setCopies(v)}
              />
              <Button type='primary' loading={checkMaxLoading} onClick={onSetMax}>
                MAX
              </Button>
            </div>
          </div>
          : lendState === 'Processing'
            ? <h2>Processing.....</h2>
            : <div>
              <h2>Success</h2>
              {copies}Share
              <Button className='primary-btn' onClick={confirmLend}>Confirm</Button>
            </div>
      }
    </SModal>

    <div className='flex'>
      <InfoCard />

      <div className='ml-32 h419 w1048'>

        <div className='flex justify-between'>
          <div>
            <div className='flex'>
              <Button className='mr-33' type='primary'>{loanInfo.state}</Button>
              <span> follow end time {<Countdown targetTimestamp={Number(loanInfo.endTime)} />}</span>
            </div>
            <div className='mb20 mt30'> {loanInfo.loanName}</div>

          </div>
          {
            prePage === 'market'
              ? <Button className='h60 w180 primary-btn' onClick={() => setIsModalOpen(true)}>Follow</Button>
              : <Button className='h60 w180 primary-btn' onClick={() => setExtractIsModalOpen(true)}>Extract</Button>
          }
        </div>

        <p>
          {loanInfo.usageIntro}
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
            <li> {loanInfo.tradingForm === 'SpotGoods' ? 'Low' : 'High'}</li>
          </ul>

          <ul className='m0 list-none p0'>
            <li>Number of copies</li>
            <li>{loanInfo.goalCopies}</li>
          </ul>

          <ul className='m0 list-none p0'>
            <li>Purchased copies</li>
            <li>{loanInfo.collectCopies}</li>
          </ul>

        </div>

      </div>
    </div>

    <Radio.Group value='large' >
      <Radio.Button value="large">Designated Position</Radio.Button>
      <Radio.Button value="default">Operation record</Radio.Button>
      <Radio.Button value="small">Room trade</Radio.Button>
    </Radio.Group>

    <DesignatedPosition lendState={lendState} refundPoolAddress={refundPoolAddress} repayCount={loanInfo.repayCount ?? 0} loanMoney={loanInfo.loanMoney ?? 0} tradeId={tradeId ? BigInt(tradeId) : null} transactionPair={loanInfo.transactionPairs ?? []} />

  </div>)
}

export default LoanDetails
