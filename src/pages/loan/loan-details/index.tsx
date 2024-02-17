import { useNavigate, useSearchParams } from 'react-router-dom'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import type { TabsProps } from 'antd'
import { Button, Divider, InputNumber, Modal, Tabs, Tooltip, message } from 'antd'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { BorderOutlined, CheckOutlined, CloseSquareOutlined, LoadingOutlined } from '@ant-design/icons'
import Image from 'antd/es/image'
import InfoCard from './components/InfoCard'
import Countdown from './components/Countdown'
import Pool from './components/Pool'
import SharesMarket from './components/SharesMarket'
import OperationRecord from './components/OperationRecord'
import IncomeCalculation from './components/IncomeCalculation'
import { LoanService } from '@/.generated/api/Loan'
import { Models } from '@/.generated/api/models'
import SModal from '@/pages/components/SModal'
import useBrowserContract from '@/hooks/useBrowserContract'
import useUserStore from '@/store/userStore'
import infoIconIcon from '@/assets/images/apply-loan/InfoIcon.png'

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

  const [sellIsModalOpen, setSellIsModalOpen] = useState(false)
  const [sellModalLoading, setSellModalLoading] = useState(false)
  const [totalShares, setTotalShares] = useState(0)
  const [sellAmount, setSellAmount] = useState('1')
  const [sellUnitPrice, setSellUnitPrice] = useState('1.00')
  const [totalPrice, setTotalPrice] = useState('1.00')

  const [sellConfirmModalOpen, setSellConfirmModalOpen] = useState(false)

  const [approved, setApproved] = useState(0)
  const [sold, setSold] = useState(0)
  const [okText, setOkText] = useState('Confirm')

  const [executing, setExecuting] = useState(false)

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
    Invalid: <div className='loan-detail-status bg-yellow'>Invalid</div>,
    Following: <div className='loan-detail-status bg-#165dff'>Fundraising </div>,
    Trading: <div className='loan-detail-status bg-#00b42a'>Ongoing</div>,
    PaidOff: <div className='loan-detail-status bg-#2d5c9a'>Settled</div>,
    PaidButArrears: <div className='loan-detail-status bg-#ff7d00'>Amount due</div>,
    Blacklist: <div className='loan-detail-status bg-#2b2b2b'>Blocked</div>,
    CloseByUncollected: <div className='loan-detail-status bg-#a9e1d7'>Settled</div>,
    Fail: <div>Failed</div>,
    ClearingFail: <div>ClearingFail</div>,
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
    if (!tradeId) {
      message.error('Operation Failed')
    }
    else {
      async function fetchSharesData() {
        const erc3525Contract = await browserContractService?.getERC3525Contract()
        const tokenId = await erc3525Contract?.getPersonalSlotToTokenId(activeUser.address!, tradeId!)
        const shares = await erc3525Contract?.tokenIdBalanceOf(tokenId!)
        setTotalShares(Number.parseInt(shares!.toString()))
      }
      fetchSharesData()
    }
    setSellAmount('1')
    setSellUnitPrice('1.00')
    setTotalPrice('1.00')
  }, [sellIsModalOpen])

  useEffect(() => {
    // setApproved(0)
    setSold(0)
    setSellModalLoading(false)
  }, [sellConfirmModalOpen])

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
        console.log(res)

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
      children: <Pool
        loanInfo={loanInfo}
        prePage={prePage}
        lendState={lentState ? 'Success' : 'Processing'}
        refundPoolAddress={refundPoolAddress}
        repayCount={loanInfo.repayCount ?? 0}
        tradeId={tradeId ? BigInt(tradeId) : null}
        transactionPair={loanInfo.transactionPairs ?? []}
      />,
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
          message.warning('You have no balance')
          throw new Error('You have no balance')
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

  async function sellConfirm() {
    if (!tradeId || sellAmount === undefined || sellUnitPrice === undefined)
      throw new Error('tradeId is undefined')

    // setSellModalLoading(true)
    setExecuting(true)

    if (approved !== 2) {
      setApproved(1)
      try {
        const approvedRes = await browserContractService?.followMarketContract_approveERC3525(BigInt(tradeId as string), BigInt(sellAmount))
        if (approvedRes)
          setApproved(2)
        else
          throw new Error('error')
      }
      catch {
        setOkText('Retry')
        setExecuting(false)
        setApproved(3)
        return
      }
    }

    try {
      setSold(1)
      // const decimals = await browserContractService?.ERC20_decimals(import.meta.env.VITE_USDC_TOKEN)
      const processedPrice = BigInt(Number.parseFloat(sellUnitPrice))
      const sellRes = await browserContractService?.followMarketContract_saleERC3525(BigInt(tradeId as string), processedPrice, BigInt(sellAmount))
      console.log('%c [ sale ]-52', 'font-size:13px; background:#8ce238; color:#d0ff7c;', sellRes)
      if (sellRes?.status !== 1) {
        message.error('Sell Transaction Failed!')
        throw new Error('Sell Transaction Failed!')
      }
      setSold(2)
      setOkText('Confirm')
      setSellConfirmModalOpen(false)
      setSellIsModalOpen(false)
      setExecuting(false)
    }
    catch (error) {
      setSold(3)
      setExecuting(false)
      setOkText('Retry')
      message.error('Transaction Failed!')
      console.log('%c [ error ]-47', 'font-size:13px; background:#8354d6; color:#c798ff;', error)
    }
  }

  const handleOk = async () => {
    if (!tradeId || !copies)
      return

    setExecuting(true)

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
      setExecuting(false)
      console.log('%c [ error ]-87', 'font-size:13px; background:#90ef5a; color:#d4ff9e;', error)
    }
    finally {
      setExecuting(false)
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
      <div className='h80 flex items-center rounded-14 bg-#12131d text-center lg:w500 max-md:justify-between lg:gap-x-30' >
        <div
          className={`text-16 lg:text-18 mx-20 h50 w200 lg:w-240 rounded-8 cursor-pointer hover:c-blue bg-#2d2d32 lh-49 ${props.activeKey === '1' && 'primary-btn'}`}
          onClick={() => setActiveKey('1')} >Pool</div>
        {/* <div
          className={`text-18 h49 w220 rounded-10 cursor-pointer hover:c-blue bg-#2d2d32 lh-49 ${props.activeKey === '2' && 'primary-btn'}`}
          onClick={() => setActiveKey('2')} >Operation record</div> */}
        <div
          className={`text-16 lg:text-18 mx-20 h50 w200 lg:w-240 rounded-8 cursor-pointer hover:c-blue bg-#2d2d32 lh-49 ${props.activeKey === '3' && 'primary-btn'}`}
          onClick={() => setActiveKey('3')} >Shares Market</div>
      </div>
    </div>)
  }

  return (<div className='w-full'>

    <Modal open={sellIsModalOpen}
      // centered={true}
      className='h238 w464 b-rd-8'
      okText="Sell"
      // onOk={() => sellConfirm()}
      onOk={() => setSellConfirmModalOpen(true)}
      onCancel={() => setSellIsModalOpen(false)}
      okButtonProps={{
        type: 'primary',
        className: 'primary-btn w-100',
        disabled: Number.parseInt(sellAmount) > totalShares || sellConfirmModalOpen,
      }}
      cancelButtonProps={{
        className: 'w-100',
      }}
    >
      <div>
        <h2>Sell Shares</h2>
        <div className='h-50 flex items-center justify-between'>
          <div className='w-120 text-18'>
            My shares:
          </div>
          <div className='text-18'>
            {totalShares}
          </div>
        </div>
        <div className='h-50 flex items-center justify-between'>
          <div className='w-120 text-18'>
            Sell Quantity:
          </div>
          <div className='flex justify-end'>
            <InputNumber
              className='w-170'
              min={'1'}
              max={totalShares.toString()}
              placeholder="Enter Quantity value"
              value={sellAmount}
              defaultValue={'1'}
              onChange={(value) => {
                setSellAmount(value!)
                setTotalPrice((Number.parseFloat(value!) * Number.parseFloat(sellUnitPrice)).toFixed(2))
              }
              }
            />
            <Button
              className='mx-12'
              type='primary'
              // loading={checkMaxLoading}
              onClick={() => {
                setSellAmount(totalShares.toString())
                setTotalPrice((totalShares * Number.parseFloat(sellUnitPrice)).toFixed(2))
              }}
              disabled={sellModalLoading}>
              Max
            </Button>
            <div className='text-18'>
              Shares
            </div>
          </div>
        </div>
        <div className='h-50 flex items-center justify-between'>
          <div className='w-120 text-18'>
            Unit Price:
          </div>
          <div className='flex justify-end'>
            <InputNumber
              className='mx-10 w-260'
              min={'0.01'}
              placeholder="Enter Unit Price"
              step="0.10"
              precision={2}
              defaultValue='1.00'
              value={sellUnitPrice}
              onChange={(value) => {
                const processedValue = value!.toString().includes('.')
                  ? value!.toString().slice(0, value!.toString().indexOf('.') + 3)
                  : value!.toString()
                setSellUnitPrice(processedValue)
                setTotalPrice((Number.parseFloat(sellAmount) * Number.parseFloat(processedValue)).toFixed(2))
              }}
            />
            <div className='text-18'>
              USD
            </div>
          </div>
        </div>
        <div className='mt-10 h-60 flex items-center justify-between'>
          <div className='w-120 text-22'>
            Total Price:
          </div>
          <div className='text-22'>
            {totalPrice}
          </div>
        </div>
      </div>
    </Modal>

    <Modal open={sellConfirmModalOpen}
      className='h238 w464 b-rd-8'
      onOk={() => sellConfirm()}
      okText={okText}
      onCancel={() => {
        setOkText('Confirm')
        setExecuting(false)
        setSellConfirmModalOpen(false)
      }}
      okButtonProps={{
        type: 'primary',
        className: 'primary-btn w-100',
        disabled: executing,
      }}
      cancelButtonProps={{
        className: 'w-100',
      }}
    >
      <div>
        <h2>Confirm to Sell</h2>
        <div className='h-40 flex items-center justify-between'>
          <div className='w-120 text-18'>
            Shares:
          </div>
          <div className='text-18'>
            {sellAmount}
          </div>
        </div>
        <div className='h-40 flex items-center justify-between'>
          <div className='w-120 text-18'>
            Unit Price:
          </div>
          <div className='text-18'>
            {sellUnitPrice}
          </div>

        </div>
        <div className='h-40 flex items-center justify-between'>
          <div className='w-120 text-18'>
            Total Price:
          </div>
          <div className='text-18'>
            {totalPrice}
          </div>

        </div>

        {/* <div hidden={!sellModalLoading}> */}
        <div className='mt-20'>
          <div className='h40 flex justify-between text-18'>
            <div className='flex'>
              <div className='mr-8'>
                1.
              </div>
              <div>
                {approved === 0
                  ? 'Approve your shares'
                  : approved === 1
                    ? 'Approving...'
                    : approved === 2
                      ? 'Approved!'
                      : 'Approval failed!'
                }
              </div>
            </div>
            <div className='mr-8'>
              {approved === 0
                ? <BorderOutlined />
                : approved === 1
                  ? <LoadingOutlined />
                  : approved === 2
                    ? <CheckOutlined className='text-green-500' />
                    : <CloseSquareOutlined className='text-red-500' />
              }
            </div>

          </div>
          <div className='h40 flex justify-between text-18'>
            <div className='flex'>
              <div className='mr-8'>
                2.
              </div>
              <div>
                {sold === 0
                  ? 'Sell to market'
                  : sold === 1
                    ? 'Selling...'
                    : sold === 2
                      ? 'Sold!'
                      : 'Sale failed!'
                }
              </div>
            </div>
            <div className='mr-8'>
              {sold === 0
                ? <BorderOutlined />
                : sold === 1
                  ? <LoadingOutlined />
                  : sold === 2
                    ? <CheckOutlined className='text-green-500' />
                    : <CloseSquareOutlined className='text-red-500' />
              }
            </div>

          </div>
        </div>
      </div>
    </Modal>

    <Modal open={extractIsModalOpen}
      className='h238 w464 b-rd-8'
      maskClosable={false}
      okText="Confirm"
      onOk={() => extractConfirm()}
      onCancel={() => {
        setExtractIsModalOpen(false)
      }}
      okButtonProps={{ type: 'primary', className: 'primary-btn', disabled: extraModalLoading }}
    >
      <div>
        <h2>
          Extract: {extractMoney}
        </h2>
      </div>
    </Modal>

    <SModal open={isModalOpen}
      maskClosable={false}
      content=
      {
        <div className='h100 w464'>
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
              disabled={executing}
            />
            <Button type='primary' loading={checkMaxLoading} onClick={onSetMax} disabled={executing}>
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
      okButtonProps={{ type: 'primary', className: 'primary-btn', disabled: executing }}
    >
      {

      }
    </SModal>

    <div className='loan-detail-info'>
      <InfoCard item={loanInfo} />
      {/* <div className="w-32"></div> */}
      <div className='ml-30 grow max-md:ml-0'>
        <div className='flex flex-col max-md:mt-30 md:min-h-420'>
          <div className='mb-20 flex items-center'>
            <div className='loan-detail-title mr-30'>
              {loanInfo.loanName}
            </div>
            <div>
              {
                // Loan status && countdown
                loanInfo.state === 'Following'
                  ? <div className='items-center lg:flex'>
                    {loanStateELMap[loanInfo.state]}
                    <div className='flex items-center lg:mx-10' > {<Countdown targetTimestamp={Number(loanInfo.collectEndTime)} />}</div>
                  </div>
                  : <> {loanInfo.state && loanStateELMap[loanInfo.state]}</>
              }
            </div>
          </div>
          <div className='mb20 grow'>
            <div>
              <Tooltip title={loanInfo.usageIntro}>
                {loanInfo.usageIntro}
              </Tooltip>
            </div>
          </div>
          <div className=''>
            {
              prePage === 'market' && loanInfo.state === 'Following'
              && <div className='flex'>
                {/* <div className='m-8 w180'></div> */}
                {/* <Button className='m-8 h40 w180 b-rd-30 primary-btn' onClick={() => setIsModalOpen(true)}>Follow</Button> */}
                <Button className='loan-detail-btn' onClick={() => setIsModalOpen(true)}>Follow</Button>
                {/* <Button className='loan-detail-btn' onClick={() => setIsModalOpen(true)}>Follow</Button> */}
              </div>
            }

            {
              prePage === 'lend'
              && <div className='flex'>
                {
                  loanInfo.state !== 'CloseByUncollected'
                  && <Button className='loan-detail-btn' onClick={() => setSellIsModalOpen(true)}>Sell</Button>
                }
                <Button className='loan-detail-btn' onClick={() => setExtractIsModalOpen(true)}>Extract</Button>
              </div>
            }

            <div className='flex flex-wrap' hidden={prePage === 'lend' || prePage === 'market'}>
              {
                (prePage === 'lend' || prePage === 'loan') && loanInfo.state === 'CloseByUncollected'
                && <div>
                  <Button className='loan-detail-btn' loading={refundLoading} onClick={refund}>Liquidate</Button>
                </div>
              }
              {
                prePage === 'loan'
                && <div>
                  <Button className='loan-detail-btn' onClick={() => setExtractIsModalOpen(true)}>Extract</Button>
                </div>
              }
              {
                // Income calculate
                loanInfo.state !== 'Invalid'
                && <div>
                  {(prePage === 'loan' || prePage === 'lend')
                    && <IncomeCalculation tradeId={tradeId ? BigInt(tradeId) : null} isOrderOriginator={prePage === 'loan'} />
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
    <Divider></Divider>

    <div className='loan-detail-option'>
      <div className='flex justify-center'>
        <div className='loan-detail-option-item'>
          <li className='loan-detail-option-title'>Loan Amount</li>
          <li className='loan-detail-option-content'>${Number(Number(ethers.formatUnits(BigInt(loanInfo.loanMoney ?? 0))).toFixed(2)).toLocaleString()}</li>
        </div>
      </div>
      <div className='flex justify-center'>
        <div className='loan-detail-option-item'>
          <li className='loan-detail-option-title'>Installments
            <Tooltip color='#303241' overlayInnerStyle={{ padding: 10 }}
              title="Repaid / Total">
              <Image className='ml-5 cursor-help' src={infoIconIcon} preview={false} />
            </Tooltip>
          </li>
          <li className='loan-detail-option-content'> {loanInfo.repayCount} / {loanInfo.periods}</li>
        </div>
      </div>
      <div className='flex justify-center'>
        <div className='loan-detail-option-item'>
          <li className='loan-detail-option-title'>Interest</li>
          <li className='loan-detail-option-content'>{BigNumber(loanInfo.interest ?? 0).div(100).toFixed(2)}%</li>
        </div>
      </div>
      <div className='flex justify-center'>
        <div className='loan-detail-option-item'>
          <li className='loan-detail-option-title'>Dividend</li>
          <li className='loan-detail-option-content'>{BigNumber(loanInfo.dividendRatio ?? 0).div(100).toFixed(2)}%</li>
        </div>
      </div>
      <div className='flex justify-center'>
        <div className='loan-detail-option-item'>
          <li className='loan-detail-option-title'>Risk Level</li>
          <li className='loan-detail-option-content'> {loanInfo.tradingForm === 'SpotGoods' ? 'Low' : 'High'}</li>
        </div>
      </div>
      <div className='flex justify-center'>
        <div className='loan-detail-option-item'>
          <li className='loan-detail-option-title'>Total Shares</li>
          <li className='loan-detail-option-content'>{loanInfo.goalCopies}</li>
        </div>
      </div>
      <div className='flex justify-center'>
        <div className='loan-detail-option-item'>
          <li className='loan-detail-option-title'>MRS
            <Tooltip color='#303241' overlayInnerStyle={{ padding: 10 }}
              title="Minimum Required Shares">
              <Image className='ml-5 cursor-help' src={infoIconIcon} preview={false} />
            </Tooltip>
          </li>
          <li className='loan-detail-option-content'>{loanInfo.minGoalQuantity}</li>
        </div>
      </div>
    </div>
    <Divider></Divider>
    <Tabs
      defaultActiveKey="1"
      items={items}
      activeKey={activeKey}
      onChange={key => setActiveKey(key)}
      renderTabBar={renderTabBar} />
  </div >)
}

export default LoanDetails
