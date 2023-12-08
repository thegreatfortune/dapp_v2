import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { TabsProps } from 'antd'
import { Button, Divider, InputNumber, Tabs, message } from 'antd'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import InfoCard from './components/InfoCard'
import Countdown from './components/Countdown'
import DesignatedPosition from './components/DesignatedPosition'
import RoomTrade from './components/RoomTrade'
import OperationRecord from './components/OperationRecord'
import IncomeCalculation from './components/IncomeCalculation'
import { LoanService } from '@/.generated/api/Loan'
import { Models } from '@/.generated/api/models'
import SModal from '@/pages/components/SModal'
import useBrowserContract from '@/hooks/useBrowserContract'
import useUserStore from '@/store/userStore'
import ShellModal from '@/pages/loan/loan-details/components/ShellModal'

const LoanDetails = () => {
  const [searchParams] = useSearchParams()
  const tradeId = searchParams.get('tradeId')

  const prePage = searchParams.get('prePage')

  const navigate = useNavigate()

  const { activeUser } = useUserStore()

  const { browserContractService } = useBrowserContract()

  const [loanInfo, setLoanInfo] = useState(new Models.LoanOrderVO())

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [extractIsModalOpen, setExtractIsModalOpen] = useState(false)
  const [extraModalLoading, setExtraModalLoading] = useState(false)

  const [shellIsModalOpen, setShellIsModalOpen] = useState(false)

  const [copies, setCopies] = useState<number | null>(1)

  const [lendState, setLendState] = useState<'Processing' | 'Success'>()

  const [checkMaxLoading, setCheckMaxLoading] = useState(false)

  const [refundPoolAddress, setRefundPoolAddress] = useState<string>()

  const [extractMoney, setExtractMoney] = useState<string>('0')

  const [extraBtnLoading, setExtraBtnLoading] = useState(false)

  const [activeKey, setActiveKey] = useState('1')

  useEffect(() => {
    if (prePage === 'trade')
      setActiveKey('3')
  }, [prePage])

  useEffect(() => {
    async function fetchData() {
      if (tradeId && extractIsModalOpen && prePage) {
        setExtraBtnLoading(true)

        if (prePage === 'loan') {
          console.log('%c [ getBorrowerToProfit ]-45', 'font-size:13px; background:#98c870; color:#dcffb4;')

          const pcc = await browserContractService?.getProcessCenterContract()

          const res = await pcc?.getBorrowerToProfit(BigInt(tradeId))

          setExtractMoney(ethers.formatUnits(res ?? 0))
        }
        else if (prePage === 'lend') {
          console.log('%c [ getUserTotalMoney ]-45', 'font-size:13px; background:#98c870; color:#dcffb4;')

          const pcc = await browserContractService?.getProcessCenterContract()

          const res = await pcc?.getUserTotalMoney(BigInt(tradeId))
          setExtractMoney(ethers.formatUnits(res ?? 0))
        }

        setExtraBtnLoading(false)
      }
    }

    fetchData()
  }, [tradeId, extractIsModalOpen, prePage])

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

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Designated Position',
      children: <DesignatedPosition loanInfo={loanInfo} prePage={prePage} lendState={lendState} refundPoolAddress={refundPoolAddress} repayCount={loanInfo.repayCount ?? 0} loanMoney={loanInfo.loanMoney ?? 0} tradeId={tradeId ? BigInt(tradeId) : null} transactionPair={loanInfo.transactionPairs ?? []} />,
    },
    {
      key: '2',
      label: 'Operation record',
      children: <OperationRecord />,
    },
    {
      key: '3',
      label: 'Room trade',
      children: <RoomTrade />,
    },
  ]

  async function extractConfirm() {
    if (!tradeId)
      return
    console.log('%c [  888888888]-203', 'font-size:13px; background:#6e3438; color:#b2787c;')
    setExtraModalLoading(true)

    // 对比当前登录用户id  判断是否是订单发起人
    try {
      console.log('%c [ activeUser.id === loanInfo.userId ]-215', 'font-size:13px; background:#177acd; color:#5bbeff;', activeUser.id, loanInfo.userId)

      if (activeUser.id === loanInfo.userId) {
        await browserContractService?.refundPool_borrowerWithdraw(BigInt(tradeId))
      }
      else {
        const balance = await browserContractService?.ERC3525_balanceOf(BigInt(tradeId))

        if (balance === undefined || balance === BigInt(0)) {
          message.warning('You have no balance, please buy ERC352')
          throw new Error('You have no balance, please buy ERC352')
        }
        await browserContractService?.refundPool_lenderWithdraw(BigInt(tradeId), BigInt(balance)) // 订单份额
      }
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

      // const ERC20Contract = await browserContractService?.getERC20Contract()

      const followManageContract = await browserContractService?.getFollowManageContract()

      const cp = await followManageContract?.getTradeIdToCapitalPool(BigInt(tradeId))

      console.log('%c [ cp ]-60', 'font-size:13px; background:#8ef2e0; color:#d2ffff;', cp)

      if (!cp)
        return

      // const amount = ethers.parseEther(BigNumber(loanInfo.loanMoney ?? 0).minus(loanInfo.goalCopies ?? 0).times(copies).toString())
      // console.log('%c [asasa amount ]-210', 'font-size:13px; background:#5d338d; color:#a177d1;', amount)

      const approveState = await browserContractService.processCenter_checkERC20Allowance(BigInt(tradeId), BigInt(copies), import.meta.env.VITE_USDC_TOKEN, cp)
      console.log('%c [55 approveState ]-216', 'font-size:13px; background:#2d89c2; color:#71cdff;', approveState)

      // const amount = await processContract.getLendStakeMoney(tradeId, BigInt(copies))

      // // const approveState = await processContract.checkERC20Allowance(import.meta.env.VITE_USDC_TOKEN, browserContractService?.getSigner.address, cp, amount)

      // const approveState = await browserContractService.ERC20_approve(browserContractService?.getSigner.address, cp, amount, import.meta.env.VITE_USDC_TOKEN)
      // console.log('%c [sas approveState ]-213', 'font-size:13px; background:#a01e3a; color:#e4627e;', approveState)

      if (!approveState)
        return

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

    <ShellModal open={shellIsModalOpen} onCancel={() => setShellIsModalOpen(false)} tradeId={tradeId ? BigInt(tradeId) : undefined} />

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
        <h2>
          extract: {extractMoney}
        </h2>
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
      <InfoCard item={loanInfo} />

      <div className='ml-32 h419 w1048'>

        <div className='flex justify-between'>
          <div>
            <div className='flex'>

              {loanInfo.state === 'Following'
                ? <div>
                  <Button className='mr-33 bg-#2d9b31' type='primary'>{loanInfo.state}</Button>
                  <span> follow end time {<Countdown targetTimestamp={Number(loanInfo.collectEndTime)} />}</span>
                </div>
                : <div>
                  <Button className='mr-33' type='primary'>{loanInfo.state}</Button>

                  {/* {prePage === 'lend' && <span>{searchParams.get('subscriptionCopies')} share = { BigNumber(searchParams.get('subscriptionCopies') ?? 0).times(searchParams.get('subscriptionUnitPrice') ?? 0).toString() } U</span>}
                  +<span>principal { BigNumber(searchParams.get('subscriptionCopies') ?? 0).times(searchParams.get('subscriptionUnitPrice') ?? 0).toString() }U</span>
                  +<span>interest { BigNumber(principalAndInterest).minus(BigNumber(searchParams.get('subscriptionCopies') ?? 0).times(searchParams.get('subscriptionUnitPrice') ?? 0)).toString() }U</span> */}
                </div>}

                {
                  loanInfo.state !== 'Invalid'
                   && <span>
                    {(prePage === 'loan' || prePage === 'lend')
                   && <IncomeCalculation tradeId={ tradeId ? BigInt(tradeId) : null} isOrderOriginator={prePage === 'loan'} />
                 }
                   </span>
                }

            </div>
            <div className='mb20 mt30'> {loanInfo.loanName}</div>

          </div>
          {
            prePage === 'market'
              ? <Button className='h60 w180 primary-btn' onClick={() => setIsModalOpen(true)}>Follow</Button>
              : prePage === 'lend'
                ? <div>
                  <Button className='h60 w180 primary-btn' onClick={() => setShellIsModalOpen(true)}>Shell</Button>
                  <Button className='h60 w180 primary-btn' onClick={() => setExtractIsModalOpen(true)}>Extract</Button>
                </div>
                : <Button className='h60 w180 primary-btn' onClick={() => setExtractIsModalOpen(true)}>Extract</Button>
          }
        </div>

        <p>
          {loanInfo.usageIntro}
        </p>

        <div className='h191 w1047 flex gap-x-24 border-5 border-#0394e8 border-solid'>

          <ul className='m0 list-none p0'>
            <li>Apply for loan </li>
            <li>{BigNumber(ethers.formatUnits(BigInt(loanInfo.loanMoney ?? 0))).toFixed(2)}</li>
            <li> {loanInfo.loanMoney && BigNumber(loanInfo.loanMoney).div(BigNumber(10).pow(18)).toFixed(2)}</li>
            <li>USDC</li>
          </ul>

          <Divider type='vertical' className='box-border h-full bg-#fff' />

          <ul className='m0 list-none p0'>
            <li>Cycle(day)/Periodn</li>
            <li>{loanInfo.periods} / {loanInfo.repayCount}</li>
          </ul>

          <ul className='m0 list-none p0'>
            <li>Interest</li>
            <li>{BigNumber(loanInfo.interest ?? 0).div(100).toPrecision(2)} %</li>
          </ul>

          <ul className='m0 list-none p0'>
            <li>dividend</li>
            <li>{BigNumber(loanInfo.dividendRatio ?? 0).div(100).toPrecision(2)} %</li>
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

    <Tabs defaultActiveKey="1" items={items} activeKey={activeKey} onChange={key => setActiveKey(key)} />

    {/* <Radio.Group value='large' >
      <Radio.Button value="large">Designated Position</Radio.Button>
      <Radio.Button value="default">Operation record</Radio.Button>
      <Radio.Button value="small">Room trade</Radio.Button>
    </Radio.Group> */}

  </div>)
}

export default LoanDetails
