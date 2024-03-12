/* eslint-disable no-multiple-empty-lines */
/* eslint-disable @typescript-eslint/indent */
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import type { TabsProps } from 'antd'
import { Button, Divider, Progress, Tabs, Tooltip } from 'antd'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import Image from 'antd/es/image'
import { useChainId } from 'wagmi'
import { isNumber } from 'lodash-es'
import InfoCard from './components/InfoCard'
import Countdown from './components/Countdown'
import Pool from './components/Pool'
import SharesMarket from './components/SharesMarket'
import OperationRecord from './components/OperationRecord'

// import ProfitsDetail from './components/ProfitsDetail'

// import { LoanService } from '@/.generated/api/Loan'
import FollowModal from './components/Modals/Follow'
import WithdrawModal from './components/Modals/Withdraw'
import ClaimModal from './components/Modals/Claim'
import ListModal from './components/Modals/List'
import { Models } from '@/.generated/api/models'
import useBrowserContract from '@/hooks/useBrowserContract'
import infoIconIcon from '@/assets/images/apply-loan/InfoIcon.png'
import loanService from '@/services/loanService'
import NotFound from '@/pages/NotFound'
import useUserStore from '@/store/userStore'

type PageState = 'borrower' | 'lender'

export interface ILoanInfo {
  showPlatformUserList?: IPlatformUser[]

  userInfo?: IUserInfo
  userId: string

  loanId: number
  state: LoanState
  name: string
  description: string
  picUrl?: string


  loanAmount: string
  interest: number
  dividend: number
  installments: number
  duration: number // days
  totalSharesCount: number
  minSharesCount: number


  raisedSharesCount: number

  tradingPlatform: SpecifiedTradingPlatformType
  tradingType: SpecifiedTradingType
  tradingToken: string[]

  raisingEndTime: number
  liquidateTime: number
  createDate: string

  isConfirm: number
}

interface IPlatformUser {
  userName?: string
  platformType?: 'Twitter'
}

interface IUserInfo {
  nickName?: string
  address: string
  platformName: string
  pictureUrl: string
  inviteCode?: string
  userId: string
  creditScore: number
}

type LoanState = 'Invalid'
  | 'Following'
  | 'Trading'
  | 'PaidOff'
  | 'PaidButArrears'
  | 'CloseByUncollected'
  | 'Blacklist'
  | 'Fail'
  | 'ClearingFail'

type SpecifiedTradingType = 'Spot' | 'Future' | 'Other'
type SpecifiedTradingPlatformType = 'Uniswap' | 'GMX' | 'Other'

const Loan = () => {
  const { Id } = useParams()
  if (!Id || !Number(Id)) {
    return (
      <div>
        invalid loan id
      </div>
    )
  }

  const loanId = Number(Id)

  const [loanInfo, setLoanInfo] = useState<Models.ILoanOrderVo>()

  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const { currentUser } = useUserStore()

  // default to lender
  const [pageState, setPageState] = useState<PageState>('lender')

  const prePage = searchParams.get('prePage')

  if (!prePage || (prePage !== 'loan' && prePage !== 'lend' && prePage !== 'market' && prePage !== 'trade'))
    return


  const { browserContractService } = useBrowserContract()


  const [lentState, setLentState] = useState(false)

  const [refundPoolAddress, setRefundPoolAddress] = useState<string>()

  const [extractMoney, setExtractMoney] = useState<string>('0')

  const [refundLoading, setRefundLoading] = useState(false)

  const [activeKey, setActiveKey] = useState('1')

  const [followUSDCAmount, setFollowUSDCAmount] = useState(BigInt(0))

  const [unitPrice, setUnitPrice] = useState(BigInt(0))

  const [maxCopies, setMaxCopies] = useState(1)

  const [currentCopies, setCurrentCopies] = useState(0)

  const chainId = useChainId()

  const [claimModalOpen, setClaimModalOpen] = useState(false)
  const [followModalOpen, setFollowModalOpen] = useState(false)
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false)
  const [listModalOpen, setListModalOpen] = useState(false)

  // const loanStateELMap: Record<typeof loanInfo.state & string, ReactElement> = {
  const loanStateELMap: Record<Models.LoanState & string, ReactElement> = {
    Invalid: <div className='loan-detail-status bg-yellow'>Invalid</div>,
    Following: <div className='loan-detail-status bg-#165dff'>Fundraising </div>,
    Trading: <div className='loan-detail-status bg-#00b42a'>Ongoing</div>,
    PaidOff: <div className='loan-detail-status bg-#2d5c9a'>Settled</div>,
    // PaidButArrears: <div className='loan-detail-status bg-#ff7d00'>Amount due</div>,
    PaidButArrears: <div className='loan-detail-status bg-#2d5c9a'>Settled</div>,
    Blacklist: <div className='loan-detail-status bg-#2b2b2b'>Blocked</div>,
    CloseByUncollected: <div className='loan-detail-status bg-#ff7d00'>Raising failed</div>,
    // CloseByUncollected: <div className='loan-detail-status bg-#a9e1d7'>Raising failed</div>,
    Fail: <div>Failed</div>,
    ClearingFail: <div>ClearingFail</div>,
  }

  useEffect(() => {
    if (prePage === 'trade')
      setActiveKey('3')
  }, [prePage])

  // useEffect(() => {
  //   async function fetchData() {
  //     if (loanId && extractIsModalOpen && prePage) {
  //       // setExtraBtnLoading(true)

  //       if (prePage === 'loan') {
  //         const pcc = await browserContractService?.getProcessCenterContract()

  //         const res = await pcc?.getBorrowerToProfit(BigInt(loanId))
  //         console.log('%c [ getBorrowerToProfit ]-82', 'font-size:13px; background:#a88d14; color:#ecd158;', res)

  //         setExtractMoney(ethers.formatUnits(res ?? 0))
  //       }
  //       else if (prePage === 'lend') {
  //         const pcc = await browserContractService?.getProcessCenterContract()
  //         const tokenId = await browserContractService?.ERC3525_getTokenId(BigInt(loanId))

  //         if (tokenId) {
  //           const res = await pcc?.getUserTotalMoney(BigInt(tokenId))
  //           console.log('%c [ getUserTotalMoney ]-82', 'font-size:13px; background:#a88d14; color:#ecd158;', res)
  //           setExtractMoney(ethers.formatUnits(res ?? 0))
  //         }
  //       }
  //       // setExtraBtnLoading(false)
  //     }
  //   }

  //   fetchData()
  // }, [loanId, extractIsModalOpen, prePage])

  // useEffect(() => {
  //   if (!loanId) {
  //     message.error('Not Found Loan!')
  //   }
  //   else {
  //     async function fetchSharesData() {
  //       if (browserContractService) {
  //         const erc3525Contract = await browserContractService?.getERC3525Contract()
  //         const tokenId = await erc3525Contract?.getPersonalSlotToTokenId(currentUser.address, loanId!)
  //         const shares = await erc3525Contract?.tokenIdBalanceOf(tokenId!)
  //         setTotalShares(Number.parseInt(shares!.toString()))
  //       }
  //     }
  //     fetchSharesData()
  //   }
  //   setSellAmount('1')
  //   setSellUnitPrice('1.00')
  //   setTotalPrice('1.00')
  // }, [sellIsModalOpen])

  // useEffect(() => {
  //   // setApproved(0)
  //   setSold(0)
  //   setSellModalLoading(false)
  // }, [sellConfirmModalOpen])

  useEffect(() => {
    async function fetchData() {
      if (!loanId || !browserContractService)
        return

      const address = await browserContractService?.getRefundPoolAddress(BigInt(loanId))

      setRefundPoolAddress(address)
    }

    fetchData()
  }, [browserContractService, loanId])

  useEffect(() => {
    async function fetchData() {
      if (loanId) {
        // const res = await LoanService.ApiLoanLoanInfo_GET(chainId, { loanId: Number(loanId) })
        const res = await loanService.getLoanDetail(chainId, { tradeId: Number(loanId) })
        setLoanInfo(preState => ({ ...preState, ...res }))
      }
    }
    fetchData()
  }, [loanId])

  useEffect(() => {
    async function updateCopies() {
      if (!loanId)
        return

      try {
        const followCapitalPoolContract = await browserContractService?.getCapitalPoolContractByTradeId(BigInt(loanId))

        const res = await followCapitalPoolContract?.getList(loanId)

        if (res) {
          setMaxCopies(Number(BigInt(res[7])) - Number(BigInt(res[9])))
          setCurrentCopies(Number(BigInt(res[9])))
          const amount = await browserContractService?.calculateFollowAmountFromCopies(BigInt(loanId!), BigInt(1))
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

  async function refund() {
    if (!loanId)
      return

    setRefundLoading(true)
    try {
      await browserContractService?.followRouter_refund(BigInt(loanId))
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

  return (!loanId
    ? (<div>
      <NotFound />
    </div>)
    : (loanInfo
      ? <div className='w-full'>

        {/* <Modal open={sellIsModalOpen}
          className='h238 w464 b-rd-8'
          okText="Sell"
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
        </Modal> */}

        {/* <Modal open={sellConfirmModalOpen}
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
        </Modal> */}

        {/* <Modal open={extractIsModalOpen}
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
        </Modal> */}

        {/* <Modal open={claimModalOpenOld}
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
        </Modal>  */}

        {/* <Modal open={followModalOpenOld}
          className='h238 w464 b-rd-8'
          okText={followModalBtnText}
          onOk={() => handleFollow()}
          onCancel={() => {
            setCopies(1)
            setUsdcApproved(0)
            setFollowed(0)
            setExecuting(false)
            setFollowModalOpenOld(false)
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
                      const amount = await browserContractService.calculateFollowAmountFromCopies(BigInt(loanId!), BigInt(v))
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
        </Modal>  */}

        <ListModal open={listModalOpen}
          setOpen={setListModalOpen}
          tradeId={Number(loanId)}
          isLoanOwner={currentUser.userId === loanInfo.userId}
        ></ListModal>

        <WithdrawModal open={withdrawModalOpen}
          setOpen={setWithdrawModalOpen}
          tradeId={BigInt(loanId)}
          userState={prePage}
          loanState={loanInfo!.state}
          loanOwner={loanInfo!.userId}
        ></WithdrawModal>

        <FollowModal open={followModalOpen}
          setOpen={setFollowModalOpen}
          tradeId={BigInt(loanId)}
        ></FollowModal>

        <ClaimModal open={claimModalOpen}
          setOpen={setClaimModalOpen}
          tradeId={Number(loanId)}
        ></ClaimModal>

        <div className='loan-detail-info'>
          <InfoCard loanDetail={loanInfo} />
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
                    prePage === 'market' && loanInfo.state === 'Following'
                    && <div className='flex'>
                      {/* <div className='m-8 w180'></div> */}
                      {/* <Button className='m-8 h40 w180 b-rd-30 primary-btn' onClick={() => setIsModalOpen(true)}>Follow</Button> */}
                      {/* <Button className='loan-detail-btn' onClick={() => setFollowModalOpenOld(true)}>Follow</Button> */}
                      <Button className='loan-detail-btn' type='primary' onClick={() => setFollowModalOpen(true)}>Follow</Button>

                    </div>
                  }
                  {
                    prePage === 'lend' && currentUser.userId !== loanInfo.userId
                    && <div className='flex'>
                      {
                        loanInfo!.state !== 'CloseByUncollected'
                        && (
                          <div>
                            {/* <Button className='loan-detail-btn' onClick={() => setSellIsModalOpen(true)}>Sell</Button> */}
                            <Button className='loan-detail-btn' type='primary' onClick={() => setListModalOpen(true)}>Sell</Button>
                          </div>
                        )

                      }
                      {/* <Button className='loan-detail-btn' onClick={() => setExtractIsModalOpen(true)}>Withdraw</Button> */}
                      <Button className='loan-detail-btn' type='primary' onClick={() => setWithdrawModalOpen(true)}>Withdraw</Button>
                    </div>
                  }

                  <div className='flex flex-wrap' hidden={prePage === 'lend' || prePage === 'market'}>
                    {
                      (prePage === 'lend' || prePage === 'loan') && loanInfo!.state === 'CloseByUncollected'
                      && <div>
                        <Button className='loan-detail-btn' type='primary' loading={refundLoading} onClick={refund}>Liquidate</Button>
                      </div>
                    }
                    {
                      prePage === 'loan'
                      && <div>
                        {/* <Button className='loan-detail-btn' onClick={() => setExtractIsModalOpen(true)}>Withdraw</Button> */}
                        <Button className='loan-detail-btn' type='primary' onClick={() => setWithdrawModalOpen(true)}>Withdraw</Button>
                      </div>
                    }
                    {
                    // TODO Profit Detail
                    /* {
                      // Income calculate
                      loanInfo!.state !== 'Invalid'
                      && <div>
                        {(prePage === 'loan' || prePage === 'lend')
                          && <ProfitsDetail
                            loanId={BigInt(loanId)}
                            isLoanOwner={prePage === 'loan' && loanInfo.userId === currentUser.userId}
                          />
                        }
                      </div>
                    } */}

                  </div>
                  <div>
                    {/* <Button className='loan-detail-btn' onClick={() => {
                      checkFofAmount()
                      setClaimModalOpenOld(true)
                    }}>Claim $FOF</Button> */}
                    <Button className='loan-detail-btn' type='primary' onClick={() => setClaimModalOpen(true)}>Claim $FOF</Button>
                  </div>
                </div>
                <div className='flex grow items-center justify-center lg:ml-20 max-lg:mt-30'>
                  <Progress percent={Number((Number(currentCopies / (maxCopies + currentCopies)) * 100).toFixed(2))} strokeColor={{ '0%': '#5eb6d2', '100%': '#8029e8' }} />
                  <div className='ml-10'>
                    Progress
                  </div>
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
                loanInfo={loanInfo}
                prePage={prePage}
                lendState={lentState ? 'Success' : 'Processing'}
                refundPoolAddress={refundPoolAddress}
                repayCount={loanInfo!.repayCount ?? 0}
                tradeId={BigInt(loanId)}
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

export default Loan
