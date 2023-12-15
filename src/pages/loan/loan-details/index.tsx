import { useNavigate, useSearchParams } from 'react-router-dom'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import type { TabsProps } from 'antd'
import { Button, Divider, InputNumber, Radio, Tabs, Tooltip, message } from 'antd'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import InfoCard from './components/InfoCard'
import Countdown from './components/Countdown'
import DesignatedPosition from './components/DesignatedPosition'
import RoomTrade from './components/RoomTrade'
import OperationRecord from './components/OperationRecord'
import IncomeCalculation from './components/IncomeCalculation'
import DetailCard from './components/DetailCard'
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

  const loanStateELMap: Record<typeof loanInfo.state & string, ReactElement> = {
    Invalid: <div className='box-border h33 min-w174 rounded-4 bg-yellow' >Invalid</div>,
    Following: <div className='box-border h33 min-w174 rounded-4 bg-#165dff' >Ongoing fundraising </div>,
    Trading: <div className='box-border h33 min-w174 rounded-4 bg-#00b42a' >Transaction ongoing</div>,
    PaidOff: <div className='box-border h33 min-w174 rounded-4 bg-#979797' >Settled transaction</div>,
    PaidButArrears: <div className='box-border h33 min-w174 rounded-4 bg-#ff7d00' >Amount due</div>,
    Blacklist: <div className='box-border h33 min-w174 rounded-4 bg-#2b2b2b' >Blacklist</div>,
  }

  useEffect(() => {
    if (prePage === 'trade')
      setActiveKey('3')
  }, [prePage])

  useEffect(() => {
    async function fetchData() {
      if (tradeId && extractIsModalOpen && prePage) {
        setExtraBtnLoading(true)

        if (prePage === 'loan') {
          const pcc = await browserContractService?.getProcessCenterContract()

          const res = await pcc?.getBorrowerToProfit(BigInt(tradeId))

          setExtractMoney(ethers.formatUnits(res ?? 0))
        }
        else if (prePage === 'lend') {
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

      // TODO
      if (prePage === 'my-lend' && loanInfo.state === 'PaidOff')
        return browserContractService?.followRouter_refundMoney(BigInt(tradeId))

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

  const renderTabBar: TabsProps['renderTabBar'] = (props): React.ReactElement => {
    return (<div className='mb-30'>
      <div className='h79 w760 flex items-center justify-center gap-x-30 rounded-14 bg-#12131d text-center' >
        <div className={`h49 w220 rounded-10 cursor-pointer hover:c-blue bg-#2d2d32 lh-49 ${props.activeKey === '1' && 'primary-btn'}`} onClick={() => setActiveKey('1')} >Poll</div>
        <div className={`h49 w220 rounded-10 cursor-pointer hover:c-blue bg-#2d2d32 lh-49 ${props.activeKey === '2' && 'primary-btn'}`} onClick={() => setActiveKey('2')} >Operation record</div>
        <div className={`h49 w220 rounded-10 cursor-pointer hover:c-blue bg-#2d2d32 lh-49 ${props.activeKey === '3' && 'primary-btn'}`} onClick={() => setActiveKey('3')} >Room trade</div>
      </div>
    </div>)
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

      <div className="w-32"></div>

      <div className='h419 w1048'>

        <div className='flex justify-between lh-33'>
          <div>
            <div className='flex text-center'>

              {loanInfo.state === 'Following'
                ? <div className='flex gap-x-20'>
                  {loanStateELMap[loanInfo.state]}

                  <span className='lh-49' > {<Countdown targetTimestamp={Number(loanInfo.collectEndTime)} />}</span>
                </div>
                : <> {loanInfo.state && loanStateELMap[loanInfo.state]}</>

              }

              {
                loanInfo.state !== 'Invalid'
                && <span>
                  {(prePage === 'loan' || prePage === 'lend')
                    && <IncomeCalculation tradeId={tradeId ? BigInt(tradeId) : null} isOrderOriginator={prePage === 'loan'} />
                  }
                </span>
              }

            </div>

            <div className='mb20 mt30 text-32 font-bold'> {loanInfo.loanName}</div>

            <div className="h12" />

          </div>
          {
            prePage === 'market' && loanInfo.state === 'Following'
            && <Button className='h60 w180 rounded-30 primary-btn' onClick={() => setIsModalOpen(true)}>Follow</Button>
          }

          {
            prePage === 'lend'
            && <div className='flex'>
              {
                loanInfo.state === 'PaidOff'
                  ? (prePage === 'lend' || prePage === 'loan') && loanInfo.state === 'PaidOff'
                  && <Button className='h60 w180 primary-btn'>Liquidate</Button>
                  : <Button className='h60 w180 primary-btn' onClick={() => setShellIsModalOpen(true)}>Shell</Button>
              }

              <Button className='h60 w180 primary-btn' onClick={() => setExtractIsModalOpen(true)}>Extract</Button>
            </div>
          }

          {
            prePage === 'loan'
            && <Button className='h60 w180 primary-btn' onClick={() => setExtractIsModalOpen(true)}>Extract</Button>
          }

        </div>

        <p className='line-clamp-3 my-6 h91 overflow-hidden text-16 font-400'>
          <Tooltip title={loanInfo.usageIntro}>
            {loanInfo.usageIntro}
          </Tooltip>
        </p>

        <div className="h20" />

        <div className='box-border h166 w1047 flex items-center gap-x-19 border-5 border-#0570f5 border-solid p-x-38 text-center'>

          {/* <div className='flex'> */}
          <ul className='m0 list-none p0'>
            <li className='text-16 c-#D1D1D1'>Loan amount</li>
            <li className="h10" />
            <li className='text-24 font-bold'>${BigNumber(ethers.formatUnits(BigInt(loanInfo.loanMoney ?? 0))).toFixed(2)}</li>
            {/* <li> {loanInfo.loanMoney && BigNumber(loanInfo.loanMoney).div(BigNumber(10).pow(18)).toFixed(2)}</li> */}
          </ul>

          <Divider type='vertical' className='box-border h-78 bg-#fff' />

          <ul className='m0 list-none p0'>
            <li className='text-16 c-#D1D1D1'>Installment</li>
            <li className="h10" />
            <li className='w140 text-28 font-bold'>{loanInfo.periods}18 / {loanInfo.repayCount}10</li>
          </ul>
          {/* </div> */}

          <ul className='m0 list-none p0'>
            <li className='text-16 c-#D1D1D1'>Interest</li>
            <li className="h10" />
            <li className='w100 text-28 font-bold'>{BigNumber(loanInfo.interest ?? 0).div(100).toFixed(2)}%</li>
          </ul>

          <ul className='m0 list-none p0'>
            <li className='text-16 c-#D1D1D1'>dividend</li>
            <li className="h10" />
            <li className='w-100 text-28 font-bold'>{BigNumber(loanInfo.dividendRatio ?? 0).div(100).toFixed(2)}%</li>
          </ul>

          <ul className='m0 list-none p0'>
            <li className='text-16 c-#D1D1D1'>Risk level</li>
            <li className="h10" />
            <li className='w70 text-28 font-bold'> {loanInfo.tradingForm === 'SpotGoods' ? 'Low' : 'High'}</li>
          </ul>

          <ul className='m0 list-none p0'>
            <li className='text-16 c-#D1D1D1'>Total shares</li>
            <li className="h10" />
            <li className='w-100 text-28 font-bold'>{loanInfo.goalCopies}</li>
          </ul>

          <ul className='m0 list-none p0'>
            <li className='text-16 c-#D1D1D1'>Minimum required shares</li>
            <li className="h10" />
            <li className='text-28 font-bold'>{loanInfo.collectCopies}</li>
          </ul>

        </div>

      </div>
    </div>

    <div className="h50" />

    <Tabs defaultActiveKey="1" items={items} activeKey={activeKey} onChange={key => setActiveKey(key)} renderTabBar={renderTabBar} />

  </div>)
}

export default LoanDetails
