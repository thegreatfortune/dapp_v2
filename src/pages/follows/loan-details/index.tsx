/* eslint-disable @typescript-eslint/indent */
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import type { TabsProps } from 'antd'
import { Button, Divider, InputNumber, Modal, Progress, Tabs, Tooltip, message } from 'antd'
import BigNumber from 'bignumber.js'
import { ethers, formatUnits } from 'ethers'
import { BorderOutlined, CheckOutlined, CloseSquareOutlined, LoadingOutlined } from '@ant-design/icons'
import Image from 'antd/es/image'
import { useChainId } from 'wagmi'
import InfoCard from './components/InfoCard'
import Countdown from './components/Countdown'
import Pool from './components/Pool'
import SharesMarket from './components/SharesMarket'
import OperationRecord from './components/OperationRecord'
import IncomeCalculation from './components/IncomeCalculation'

// import { LoanService } from '@/.generated/api/Loan'
import { Models } from '@/.generated/api/models'
import useBrowserContract from '@/hooks/useBrowserContract'
import useUserStore from '@/store/userStore'
import infoIconIcon from '@/assets/images/apply-loan/InfoIcon.png'
import toCurrencyString from '@/utils/convertToCurrencyString'
import loanService from '@/services/loanService'
import NotFound from '@/pages/NotFound'

const LoanDetails = () => {
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const tradeId = searchParams.get('tradeId')

  if (!tradeId)
    setTimeout(() => navigate('/follows'), 3000)

  const prePage = searchParams.get('prePage')

  const { currentUser } = useUserStore()

  const { browserContractService } = useBrowserContract()

  const [loanInfo, setLoanInfo] = useState<Models.ILoanOrderVO>()

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
  const [claimModalOpen, setClaimModalOpen] = useState(false)
  const [claimAmount, setClaimAmount] = useState(0)
  const [claimBtndisable, setClaimBtndisable] = useState(true)

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

  const [followUSDCAmount, setFollowUSDCAmount] = useState(BigInt(0))

  const [unitPrice, setUnitPrice] = useState(BigInt(0))

  const [maxCopies, setMaxCopies] = useState(1)

  const [currentCopies, setCurrentCopies] = useState(0)

  const [followModalOpen, setFollowModalOpen] = useState(false)
  const [usdcApproved, setUsdcApproved] = useState(0)
  const [followed, setFollowed] = useState(0)

  const [followModalBtnText, setFollowModalBtnText] = useState('Follow')

  const chainId = useChainId()

  // const loanStateELMap: Record<typeof loanInfo.state & string, ReactElement> = {
  const loanStateELMap: Record<Models.LoanState & string, ReactElement> = {
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
      message.error('Not Found Loan!')
    }
    else {
      async function fetchSharesData() {
        if (browserContractService) {
          const erc3525Contract = await browserContractService?.getERC3525Contract()
          const tokenId = await erc3525Contract?.getPersonalSlotToTokenId(currentUser.address, tradeId!)
          const shares = await erc3525Contract?.tokenIdBalanceOf(tokenId!)
          setTotalShares(Number.parseInt(shares!.toString()))
        }
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
        // const res = await LoanService.ApiLoanLoanInfo_GET(chainId, { tradeId: Number(tradeId) })
        const res = await loanService.getLoanDetail(chainId, { tradeId: Number(tradeId) })
        setLoanInfo(preState => ({ ...preState, ...res }))
      }
    }
    fetchData()
  }, [tradeId])

  useEffect(() => {
    async function updateCopies() {
      if (!tradeId)
        return

      try {
        const followCapitalPoolContract = await browserContractService?.getCapitalPoolContractByTradeId(BigInt(tradeId))

        const res = await followCapitalPoolContract?.getList(tradeId)

        if (res) {
          setMaxCopies(Number(BigInt(res[7])) - Number(BigInt(res[9])))
          setCurrentCopies(Number(BigInt(res[9])))
          const amount = await browserContractService?.calculateFollowAmountFromCopies(BigInt(tradeId!), BigInt(1))
          setFollowUSDCAmount(amount ?? BigInt(0))
          setUnitPrice(amount ?? BigInt(0))
        }
      }
      catch (error) {
        console.log('%c [ error ]-107', 'font-size:13px; background:#64ed0c; color:#a8ff50;', error)
      }
    }
    updateCopies()
  }, [browserContractService])

  // const items: TabsProps['items'] = [
  //   {
  //     key: '1',
  //     label: 'Pool',
  //     children: <Pool
  //       loanInfo={loanInfo!}
  //       prePage={prePage}
  //       lendState={lentState ? 'Success' : 'Processing'}
  //       refundPoolAddress={refundPoolAddress}
  //       repayCount={loanInfo?.repayCount ?? 0}
  //       tradeId={tradeId ? BigInt(tradeId) : null}
  //       transactionPair={loanInfo?.transactionPairs ?? []}
  //     />,
  //   },
  //   {
  //     key: '2',
  //     label: 'Operation record',
  //     children: <OperationRecord />,
  //   },
  //   {
  //     key: '3',
  //     label: 'Shares market',
  //     children: <SharesMarket />,
  //   },
  // ]

  async function extractConfirm() {
    if (!tradeId)
      return
    setExtraModalLoading(true)

    // 对比当前登录用户id  判断是否是订单发起人
    try {
      if (prePage === 'my-lend' && loanInfo!.state === 'PaidOff')
        return browserContractService?.followRouter_refundMoney(BigInt(tradeId))

      if (currentUser.userId === loanInfo!.userId) {
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
      // const decimals = await browserContractService?.ERC20_decimals(import.meta.env.VITE_TOKEN_USDC)
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

  const handleFollow = async () => {
    if (!tradeId || !copies)
      return

    setExecuting(true)

    if (!browserContractService)
      return

    try {
      setUsdcApproved(1)

      const allowance = await browserContractService.checkUsdcAllowance()

      if (allowance >= followUSDCAmount) {
        setUsdcApproved(2)
      }
      else {
        const approveRes = await browserContractService.approveBeforeFollow(ethers.parseEther(BigNumber(2 * 10 ** 6).toString()))
        if (approveRes?.status === 1)
          setUsdcApproved(2)
        else
          throw new Error('Failed')
      }
    }
    catch (error) {
      console.log(error)
      setUsdcApproved(3)
      setExecuting(false)
      message.error('Transaction failed!')
      return
    }

    try {
      setFollowed(1)
      const result = await browserContractService.capitalPool_lend(BigInt(copies), BigInt(tradeId))
      console.log('%c [ result ]-114', 'font-size:13px; background:#b71c0a; color:#fb604e;', result)

      if (result?.status !== 1)
        message.error('Transaction failed!')

      setFollowed(2)
      setLentState(true)
    }
    catch (error) {
      setFollowed(3)
      message.error('Transaction failed!')
      setExecuting(false)
      console.log('%c [ error ]-87', 'font-size:13px; background:#90ef5a; color:#d4ff9e;', error)
      return
    }
    setTimeout(() => {
      setFollowModalBtnText('Finished')
      setLendingState(false)
      setFollowModalOpen(false)
      setExecuting(false)
      location.reload()
    }, 3000)
  }

  const checkFofAmount = async () => {
    if (!browserContractService)
      return
    if (tradeId) {
      const withdrawed = await browserContractService.checkWithdrawed(Number(tradeId))

      if (!withdrawed) {
        const fofBalance = await browserContractService?.checkClaimableFofAmount(Number(tradeId))
        if (fofBalance > 0)
          setClaimBtndisable(false)
        const result = formatUnits(fofBalance ?? 0, 18)
        setClaimAmount(Number(result))
      }
      else {
        setClaimAmount(0)
      }
    }
  }

  const claim = async () => {
    setClaimBtndisable(true)
    if (!browserContractService || !tradeId)
      return

    try {
      const res = await browserContractService?.claimFof(Number(tradeId))
      if (res?.status !== 1)
        throw new Error('Failed')
      message.success('Transaction successfully!')
      setTimeout(() => {
        setClaimAmount(0)
        setClaimModalOpen(false)
      }, 3000)
    }
    catch (error) {
      message.error('Transaction failed!')
      setClaimBtndisable(false)
    }
  }

  async function onSetMax() {
    const amount = await browserContractService?.calculateFollowAmountFromCopies(BigInt(tradeId!), BigInt(maxCopies))
    setFollowUSDCAmount(amount ?? BigInt(0))
    setCopies(maxCopies)
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

  return (!tradeId
    ? (<div>
      <NotFound />
    </div>)
    : (loanInfo
      ? <div className='w-full'>

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

        <Modal open={claimModalOpen}
          className='h238 w464 b-rd-8'
          maskClosable={false}
          okText="Claim"
          onOk={claim}
          onCancel={() => {
            setClaimBtndisable(true)
            setClaimModalOpen(false)
            setClaimAmount(0)
          }}
          okButtonProps={{ type: 'primary', className: 'primary-btn', disabled: claimBtndisable }}
        >
          <div>
            <h2>
              Claim:
            </h2>
            <div>
              You can claim {toCurrencyString(claimAmount)} $FOF!
            </div>
          </div>
        </Modal>

        <Modal open={followModalOpen}
          className='h238 w464 b-rd-8'
          okText={followModalBtnText}
          onOk={() => handleFollow()}
          onCancel={() => {
            setCopies(1)
            setUsdcApproved(0)
            setFollowed(0)
            setExecuting(false)
            setFollowModalOpen(false)
          }}
          okButtonProps={{ type: 'primary', className: 'primary-btn', disabled: executing }}
        >
          <div>
            <h2 className='font-b m-10 w40 flex items-center text-20 c-#fff lh-21'>
              {lendingState ? 'Processing' : 'Share'}
            </h2>
            <div className='w-full flex content-center items-center justify-end'>
              <InputNumber
                size='large'
                value={copies}
                className='m-10 w-full w150 b-#808080 text-center'
                min={1}
                onChange={async (v) => {
                  if (!browserContractService?.getSigner.address)
                    return
                  if (v) {
                    if (v > maxCopies) {
                      message.error('You can not follow over max shares!')
                      v = maxCopies
                    }
                    else {
                      const amount = await browserContractService.calculateFollowAmountFromCopies(BigInt(tradeId!), BigInt(v))
                      setFollowUSDCAmount(amount)
                    }
                  }
                  setCopies(v)
                }}
                disabled={executing}
              />
              <Button type='primary' loading={checkMaxLoading} onClick={onSetMax} disabled={executing}>
                Max
              </Button>
            </div>
            <div className='flex justify-end'>
              {copies} Share = {copies === 1 ? formatUnits(unitPrice, 18) : formatUnits(followUSDCAmount, 18)} USDC
            </div>
            <div className='mt-30'>
              {
                usdcApproved === 0
                  ? <div className='flex items-center justify-between'>
                    <div className='flex'>
                      <div className='mr-8'>1.</div>Approve your USDC for Follow Finance Protocol</div>
                    <div className='m-8'><BorderOutlined /></div>
                  </div>
                  : usdcApproved === 1
                    ? <div className='flex items-center justify-between'>
                      <div className='flex'>
                        <div className='mr-8'>1.</div>Approve...</div>
                      <div className='m-8'><LoadingOutlined /></div>
                    </div>
                    : usdcApproved === 2
                      ? <div className='flex items-center justify-between'>
                        <div className='flex'>
                          <div className='mr-8'>1.</div>Approved successfully!</div>
                        <div className='m-8'><CheckOutlined className='text-green-500' /></div>
                      </div>
                      : <div className='flex items-center justify-between'>
                        <div className='flex'>
                          <div className='mr-8'>1.</div>Approval failed!</div>
                        <div className='m-8'><CloseSquareOutlined className='text-red-500' /></div>
                      </div>
              }
              {
                followed === 0
                  ? <div className='flex items-center justify-between'>
                    <div className='flex'>
                      <div className='mr-8'>2.</div>Follow this loan</div>
                    <div className='m-8'><BorderOutlined /></div>
                  </div>
                  : followed === 1
                    ? <div className='flex items-center justify-between'>
                      <div className='flex'>
                        <div className='mr-8'>2.</div>Following...</div>
                      <div className='m-8'><LoadingOutlined /></div>
                    </div>
                    : followed === 2
                      ? <div className='flex items-center justify-between'>
                        <div className='flex'>
                          <div className='mr-8'>2.</div>Followed successfully!</div>
                        <div className='m-8'><CheckOutlined className='text-green-500' /></div>
                      </div>
                      : <div className='flex items-center justify-between'>
                        <div className='flex'>
                          <div className='mr-8'>2.</div>Follow failed!</div>
                        <div className='m-8'><CloseSquareOutlined className='text-red-500' /></div>
                      </div>
              }
            </div>
          </div>
        </Modal >

        <div className='loan-detail-info'>
          <InfoCard item={loanInfo!} />
          {/* <div className="w-32"></div> */}
          <div className='ml-30 grow max-md:ml-0'>
            <div className='flex flex-col max-md:mt-30 md:min-h-420'>
              <div className='mb-20 flex items-center'>
                <div className='loan-detail-title mr-30'>
                  {loanInfo!.loanName}
                </div>
                <div>
                  {
                    // Loan status && countdown
                    loanInfo!.state === 'Following'
                      ? <div className='items-center lg:flex'>
                        {loanStateELMap[loanInfo!.state]}
                        <div className='flex items-center lg:mx-10' > {<Countdown targetTimestamp={Number(loanInfo!.collectEndTime)} />}</div>
                      </div>
                      : <> {loanInfo!.state && loanStateELMap[loanInfo!.state]}</>
                  }
                </div>
              </div>
              <div className='mb20 grow'>
                <div>
                  <Tooltip title={loanInfo!.usageIntro}>
                    {loanInfo!.usageIntro}
                  </Tooltip>
                </div>
              </div>
              <div className='lg:flex'>
                <div className='flex'>
                  {
                    prePage === 'market' && loanInfo!.state === 'Following'
                    && <div className='flex'>
                      {/* <div className='m-8 w180'></div> */}
                      {/* <Button className='m-8 h40 w180 b-rd-30 primary-btn' onClick={() => setIsModalOpen(true)}>Follow</Button> */}
                      <Button className='loan-detail-btn' onClick={() => setFollowModalOpen(true)}>Follow</Button>
                      {/* <Button className='loan-detail-btn' onClick={() => setIsModalOpen(true)}>Follow</Button> */}

                    </div>
                  }

                  {
                    prePage === 'lend'
                    && <div className='flex'>
                      {
                        loanInfo!.state !== 'CloseByUncollected'
                        && <Button className='loan-detail-btn' onClick={() => setSellIsModalOpen(true)}>Sell</Button>
                      }
                      <Button className='loan-detail-btn' onClick={() => setExtractIsModalOpen(true)}>Withdraw</Button>
                    </div>
                  }

                  <div className='flex flex-wrap' hidden={prePage === 'lend' || prePage === 'market'}>
                    {
                      (prePage === 'lend' || prePage === 'loan') && loanInfo!.state === 'CloseByUncollected'
                      && <div>
                        <Button className='loan-detail-btn' loading={refundLoading} onClick={refund}>Liquidate</Button>
                      </div>
                    }
                    {
                      prePage === 'loan'
                      && <div>
                        <Button className='loan-detail-btn' onClick={() => setExtractIsModalOpen(true)}>Withdraw</Button>
                      </div>
                    }
                    {
                      // Income calculate
                      loanInfo!.state !== 'Invalid'
                      && <div>
                        {(prePage === 'loan' || prePage === 'lend')
                          && <IncomeCalculation tradeId={tradeId ? BigInt(tradeId) : null} isOrderOriginator={prePage === 'loan'} />
                        }
                      </div>
                    }

                  </div>
                  <div>
                    <Button className='loan-detail-btn' onClick={() => {
                      checkFofAmount()
                      setClaimModalOpen(true)
                    }}>Claim $FOF</Button>
                  </div>
                </div>
                <div className='flex grow items-center justify-center lg:ml-20 max-lg:mt-30'>
                  <Progress percent={Number(currentCopies / (maxCopies + currentCopies)) * 100} strokeColor={{ '0%': '#5eb6d2', '100%': '#8029e8' }} /> Progress
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
              <li className='loan-detail-option-content'>${Number(Number(ethers.formatUnits(BigInt(loanInfo!.loanMoney ?? 0))).toFixed(2)).toLocaleString()}</li>
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
              <li className='loan-detail-option-content'> {loanInfo!.repayCount} / {loanInfo!.periods}</li>
            </div>
          </div>
          <div className='flex justify-center'>
            <div className='loan-detail-option-item'>
              <li className='loan-detail-option-title'>Interest</li>
              <li className='loan-detail-option-content'>{BigNumber(loanInfo!.interest ?? 0).div(100).toFixed(2)}%</li>
            </div>
          </div>
          <div className='flex justify-center'>
            <div className='loan-detail-option-item'>
              <li className='loan-detail-option-title'>Dividend</li>
              <li className='loan-detail-option-content'>{BigNumber(loanInfo!.dividendRatio ?? 0).div(100).toFixed(2)}%</li>
            </div>
          </div>
          <div className='flex justify-center'>
            <div className='loan-detail-option-item'>
              <li className='loan-detail-option-title'>Risk Level</li>
              <li className='loan-detail-option-content'> {loanInfo!.tradingForm === Models.SpecifiedTradingTypeEnum.Spot ? 'Low' : 'High'}</li>
            </div>
          </div>
          <div className='flex justify-center'>
            <div className='loan-detail-option-item'>
              <li className='loan-detail-option-title'>Total Shares</li>
              <li className='loan-detail-option-content'>{loanInfo!.goalCopies}</li>
            </div>
          </div>
          <div className='flex justify-center'>
            <div className='loan-detail-option-item'>
              <li className='loan-detail-option-title'>MRRS
                <Tooltip color='#303241' overlayInnerStyle={{ padding: 10 }}
                  title="Minimum Required Raising Shares">
                  <Image className='ml-5 cursor-help' src={infoIconIcon} preview={false} />
                </Tooltip>
              </li>
              <li className='loan-detail-option-content'>{loanInfo!.minGoalQuantity}</li>
            </div>
          </div>
        </div>
        <Divider></Divider>
        <Tabs
          defaultActiveKey="1"
          // items={items}
          items={[
            {
              key: '1',
              label: 'Pool',
              children: <Pool
                loanInfo={loanInfo!}
                prePage={prePage}
                lendState={lentState ? 'Success' : 'Processing'}
                refundPoolAddress={refundPoolAddress}
                repayCount={loanInfo!.repayCount ?? 0}
                tradeId={BigInt(tradeId)}
                transactionPair={loanInfo!.transactionPairs ?? []}
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
          ]}
          activeKey={activeKey}
          onChange={key => setActiveKey(key)}
          renderTabBar={renderTabBar} />
      </div >
      : <></>
    )
  )
}

export default LoanDetails
