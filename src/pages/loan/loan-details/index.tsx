import { useNavigate, useSearchParams } from 'react-router-dom'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import type { TabsProps } from 'antd'
import { Button, Divider, InputNumber, Tabs, Tooltip, message } from 'antd'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import InfoCard from './components/InfoCard'
import Countdown from './components/Countdown'
import Pool from './components/Pool'
import ShellModal from './components/ShellModal'
import SharesMarket from './components/SharesMarket'
import OperationRecord from './components/OperationRecord'
import IncomeCalculation from './components/IncomeCalculation'
import { LoanService } from '@/.generated/api/Loan'
import { Models } from '@/.generated/api/models'
import SModal from '@/pages/components/SModal'
import useBrowserContract from '@/hooks/useBrowserContract'
import useUserStore from '@/store/userStore'

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

  const [lendingState, setLendingState] = useState(false)

  const [lentState, setLentState] = useState(false)

  const [checkMaxLoading, setCheckMaxLoading] = useState(false)

  const [refundPoolAddress, setRefundPoolAddress] = useState<string>()

  const [extractMoney, setExtractMoney] = useState<string>('0')

  // const [extraBtnLoading, setExtraBtnLoading] = useState(false)

  const [refundLoading, setRefundLoading] = useState(false)

  const [activeKey, setActiveKey] = useState('1')

  const loanStateELMap: Record<typeof loanInfo.state & string, ReactElement> = {
    Invalid: <div className='box-border h40 min-w174 flex items-center justify-center rounded-4 bg-yellow'>Invalid</div>,
    Following: <div className='box-border h40 min-w174 flex items-center justify-center rounded-4 bg-#165dff'>Ongoing fundraising </div>,
    Trading: <div className='box-border h40 min-w174 flex items-center justify-center rounded-4 bg-#00b42a'>Transaction ongoing</div>,
    PaidOff: <div className='box-border h40 min-w174 w174 flex items-center justify-center rounded-4 bg-#2d5c9a'>Settled transaction</div>,
    PaidButArrears: <div className='box-border h40 min-w174 flex items-center justify-center rounded-4 bg-#ff7d00'>Amount due</div>,
    Blacklist: <div className='ounded-4 box-border h40 min-w174 flex items-center justify-center bg-#2b2b2b'>Blacklist</div>,
    CloseByUncollected: <div className='box-border h40 min-w174 flex items-center justify-center rounded-4 bg-#a9e1d7'>Settled transaction</div>,
    Fail: <div></div>,
    ClearingFail: <div></div>,
  }

  useEffect(() => {
    if (prePage === 'trade')
      setActiveKey('3')
  }, [prePage])

  useEffect(() => {
    async function fetchData() {
      if (tradeId && extractIsModalOpen && prePage) {
        // setExtraBtnLoading(true)

        if (prePage === 'loan') {
          const pcc = await browserContractService?.getProcessCenterContract()

          const res = await pcc?.getBorrowerToProfit(BigInt(tradeId))
          console.log('%c [ getBorrowerToProfit ]-82', 'font-size:13px; background:#a88d14; color:#ecd158;', res)

          setExtractMoney(ethers.formatUnits(res ?? 0))
        }
        else if (prePage === 'lend') {
          const pcc = await browserContractService?.getProcessCenterContract()
          const tokenId = await browserContractService?.ERC3525_getTokenId(BigInt(tradeId))

          if (tokenId) {
            const res = await pcc?.getUserTotalMoney(BigInt(tokenId))
            console.log('%c [ getUserTotalMoney ]-82', 'font-size:13px; background:#a88d14; color:#ecd158;', res)
            setExtractMoney(ethers.formatUnits(res ?? 0))
          }
        }

        // setExtraBtnLoading(false)
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
      label: 'Pool',
      children: <Pool loanInfo={loanInfo} prePage={prePage} lendState={lentState ? 'Success' : 'Processing'} refundPoolAddress={refundPoolAddress} repayCount={loanInfo.repayCount ?? 0} tradeId={tradeId ? BigInt(tradeId) : null} transactionPair={loanInfo.transactionPairs ?? []} />,
    },
    {
      key: '2',
      label: 'Operation record',
      children: <OperationRecord />,
    },
    {
      key: '3',
      label: 'Shares market',
      children: <SharesMarket />,
    },
  ]

  async function extractConfirm() {
    if (!tradeId)
      return
    setExtraModalLoading(true)

    // 对比当前登录用户id  判断是否是订单发起人
    try {
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

    setLendingState(true)

    try {
      if (!browserContractService?.getSigner.address)
        return

      const result = await browserContractService.capitalPool_lend(BigInt(copies), BigInt(tradeId))
      console.log('%c [ result ]-114', 'font-size:13px; background:#b71c0a; color:#fb604e;', result)

      if (result?.status !== 1)
        message.error('Transaction failed!')

      setLentState(true)
    }
    catch (error) {
      message.error('Operation failed!')

      console.log('%c [ error ]-87', 'font-size:13px; background:#90ef5a; color:#d4ff9e;', error)
    }
    finally {
      setLendingState(false)
      navigate('/my-lend')
      setIsModalOpen(false)
    }
  }

  async function onSetMax() {
    setCheckMaxLoading(true)
  }

  // function confirmLend() {
  //   navigate('/my-lend')
  //   setIsModalOpen(false)
  //   setLendingState(false)
  // }

  async function refund() {
    if (!tradeId)
      return

    setRefundLoading(true)
    try {
      await browserContractService?.followRouter_refund(BigInt(tradeId))
    }
    catch (error) {
      console.log('%c [ error ]-234', 'font-size:13px; background:#8fde62; color:#d3ffa6;', error)
    }
    finally {
      setRefundLoading(false)
    }
  }

  const renderTabBar: TabsProps['renderTabBar'] = (props): React.ReactElement => {
    return (<div className='mb-30'>
      <div className='h79 w760 flex items-center justify-center gap-x-30 rounded-14 bg-#12131d text-center' >
        <div className={`h49 w220 rounded-10 cursor-pointer hover:c-blue bg-#2d2d32 lh-49 ${props.activeKey === '1' && 'primary-btn'}`} onClick={() => setActiveKey('1')} >Pool</div>
        <div className={`h49 w220 rounded-10 cursor-pointer hover:c-blue bg-#2d2d32 lh-49 ${props.activeKey === '2' && 'primary-btn'}`} onClick={() => setActiveKey('2')} >Operation record</div>
        <div className={`h49 w220 rounded-10 cursor-pointer hover:c-blue bg-#2d2d32 lh-49 ${props.activeKey === '3' && 'primary-btn'}`} onClick={() => setActiveKey('3')} >Shares market</div>
      </div>
    </div>)
  }

  return (<div className='w-full'>

    <ShellModal open={shellIsModalOpen} onCancel={() => setShellIsModalOpen(false)} tradeId={tradeId ? BigInt(tradeId) : undefined} />

    <SModal
      className='h238 w464 b-rd-8'
      open={extractIsModalOpen}
      maskClosable={false}
      content={
        <div>
          <h2>
            Extract: {extractMoney}
          </h2>
        </div>
        // [<Button key="submit" loading={extraModalLoading} type="primary" onClick={() => extractConfirm()}>
        //   confirm
        // </Button>,
        // <Button key="Cancel" onClick={() => setExtractIsModalOpen(false)}>
        //   Cancel
        // </Button>,
        // ]
      }
      okText="Confirm"
      onOk={() => extractConfirm()}
      onCancel={() => setExtractIsModalOpen(false)}
      okButtonProps={{ type: 'primary', className: 'primary-btn', disabled: extraModalLoading }}
    >

    </SModal>

    <SModal open={isModalOpen}
      maskClosable={false}
      content=
      {
        <div className='h100 w464 flex'>
          <h1 className='font-b m-10 w40 flex items-center text-20 lh-21 c-#fff'>
            {lendingState ? 'Processing' : 'Share'}
          </h1>
          <div className='w-full flex content-center items-center justify-end'>
            <InputNumber
              size='large'
              value={copies}
              className='m-10 w-full w150 b-#808080 text-center'
              min={1}
              onChange={v => setCopies(v)}
              disabled={lendingState}
            />
            <Button type='primary' loading={checkMaxLoading} onClick={onSetMax} disabled={lendingState}>
              Max
            </Button>
          </div>
        </div>
        // : lendState === 'Processing'
        //   ? <h2>Processing.....</h2>
        //   : <div>
        //     <h2>Success</h2>
        //     {copies}Share
        //     <Button className='primary-btn' onClick={confirmLend}>Confirm</Button>
        //   </div>
        // lendState === 'Processing'
        //   ? null
        //   : [
        //     <Button key="submit" type="primary" onClick={() => handleOk()} className='float-left h32 w113 b-rd-2 from-[#0154fa] to-[#11b5dd] bg-gradient-to-r'>Confirm</Button>,
        //     lendState === 'Success'
        //       ? null
        //       : <Button key="Cancel" onClick={() => setIsModalOpen(false)} className='h32 w113 b-rd-2 bg-#f2f3f5 text-14 c-#1f1f1f'>Cancel</Button>,
        //   ]
      }
      okText="Confirm"
      onOk={() => handleOk()}
      onCancel={() => setIsModalOpen(false)}
      okButtonProps={{ type: 'primary', className: 'primary-btn', disabled: lendingState }}
    >
      {

      }
    </SModal>

    <div className='flex'>
      <InfoCard item={loanInfo} />

      <div className="w-32"></div>

      <div className='h419 w1048'>

        <div className='flex justify-between lh-33'>
          <div>
            <div className='m-8 flex text-center'>

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
            (prePage === 'lend' || prePage === 'loan') && loanInfo.state === 'CloseByUncollected'
            && <Button loading={refundLoading} className='h60 w180 primary-btn' onClick={refund}>Liquidate</Button>
          }

          {
            prePage === 'lend'
            && <div className='flex'>
              {
                loanInfo.state !== 'CloseByUncollected'
                && <Button className='m-8 h40 w180 b-rd-30 primary-btn' onClick={() => setShellIsModalOpen(true)}>Sell</Button>

              }

              <Button className='m-8 h40 w180 b-rd-30 primary-btn' onClick={() => setExtractIsModalOpen(true)}>Extract</Button>
            </div>
          }

          {
            prePage === 'loan'
            && <Button className='h60 w180 b-rd-30 primary-btn' onClick={() => setExtractIsModalOpen(true)}>Extract</Button>
          }

        </div>

        <p className='line-clamp-3 my-6 h91 overflow-hidden text-16 font-400'>
          <Tooltip title={loanInfo.usageIntro}>
            {loanInfo.usageIntro}
          </Tooltip>
        </p>

        <div className="h20" />

        <div className='h166 w1047 flex items-center gap-x-19 p-x-38 text-center'>

          {/* <div className='flex'> */}
          <ul className='m0 list-none p0'>
            <li className='text-16 c-#D1D1D1'>Loan amount</li>
            <li className="h10" />
            <li className='text-24 font-bold'>${BigNumber(ethers.formatUnits(BigInt(loanInfo.loanMoney ?? 0))).toFixed(2)}</li>
            {/* <li> {loanInfo.loanMoney && BigNumber(loanInfo.loanMoney).div(BigNumber(10).pow(18)).toFixed(2)}</li> */}
          </ul>

          <Divider type='vertical' className='box-border h-78 bg-#fff' />

          <ul className='m0 w150 list-none p0'>
            <li className='text-16 c-#D1D1D1'>Installment</li>
            <li className="h10" />
            <li className='text-28 font-bold'>{loanInfo.periods}/ {loanInfo.repayCount}</li>
          </ul>
          {/* </div> */}

          <ul className='m0 w100 list-none p0'>
            <li className='text-16 c-#D1D1D1'>Interest</li>
            <li className="h10" />
            <li className='text-28 font-bold'>{BigNumber(loanInfo.interest ?? 0).div(100).toFixed(2)}%</li>
          </ul>

          <ul className='m0 w100 list-none p0'>
            <li className='text-16 c-#D1D1D1'>dividend</li>
            <li className="h10" />
            <li className='text-28 font-bold'>{BigNumber(loanInfo.dividendRatio ?? 0).div(100).toFixed(2)}%</li>
          </ul>

          <ul className='m0 w80 list-none p0'>
            <li className='text-16 c-#D1D1D1'>Risk level</li>
            <li className="h10" />
            <li className='text-28 font-bold'> {loanInfo.tradingForm === 'SpotGoods' ? 'Low' : 'High'}</li>
          </ul>

          <ul className='m0 w100 list-none p0'>
            <li className='text-16 c-#D1D1D1'>Total shares</li>
            <li className="h10" />
            <li className='w-100 text-28 font-bold'>{loanInfo.goalCopies}</li>
          </ul>

          <ul className='m0 w230 list-none p0'>
            <li className='text-16 c-#D1D1D1'>Minimum required shares</li>
            <li className="h10" />
            <li className='text-28 font-bold'>{loanInfo.minGoalQuantity}</li>
          </ul>

        </div>

      </div>
    </div>

    <div className="h50" />

    <Tabs defaultActiveKey="1" items={items} activeKey={activeKey} onChange={key => setActiveKey(key)} renderTabBar={renderTabBar} />

  </div>)
}

export default LoanDetails
