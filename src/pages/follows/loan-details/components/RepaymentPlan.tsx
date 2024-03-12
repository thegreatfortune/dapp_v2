import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Button, InputNumber, List, Skeleton, message } from 'antd'
import { ethers } from 'ethers'
import dayjs from 'dayjs'
import { useChainId } from 'wagmi'
import { RepayPlanService } from '../../../../.generated/api/RepayPlan'
import Address from '../../../components/Address'
import Liquidate from './Modals/Liquidate'
import { Models } from '@/.generated/api/models'
import SModal from '@/pages/components/SModal'
import useBrowserContract from '@/hooks/useBrowserContract'
import toCurrencyString from '@/utils/convertToCurrencyString'

// TODO 已经清算过，没有欠款，但是还是显示逾期有欠款，必须要repay一次合约，0资金，才会正常
interface IProps {
  tradeId: bigint
  repayCount: number
  refundPoolAddress: string | undefined
  // lendState: 'Processing' | 'Success' | undefined
  lendState: Models.LoanState
}

function calculateOverdueDays(startTime: string): number {
  // 将后端返回的时间字符串转换为 dayjs 对象
  const startDate = dayjs(startTime)

  // 获取当前时间
  const currentDate = dayjs()

  // 计算时间差（以毫秒为单位）
  const timeDifference = currentDate.diff(startDate, 'day')

  // 获取整数部分作为逾期天数
  const overdueDays = Math.floor(timeDifference)

  return overdueDays
}

const RepaymentPlan: React.FC<IProps> = ({ tradeId, repayCount, refundPoolAddress, lendState }) => {
  const chainId = useChainId()

  const { browserContractService } = useBrowserContract()

  const [pagination, setPagination] = useState<Models.ApiRepayPlanPageInfoGETParams>({
    ...new Models.ApiRepayPlanPageInfoGETParams(),
    limit: 10,
    page: 0,
  })
  // const [result, setResult] = useState(new Models.PageResult<Models.RepayPlanVo>())

  const [result, setResult] = useState<Models.IPageResult<Models.RepayPlanVo>>()
  const [loading, setLoading] = useState(false)

  const [modalLoading, setModalLoading] = useState(false)

  const [confirmLoading, setConfirmLoading] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [arrears, setArrears] = useState<string>('0')

  const [supplyAmount, setSupplyAmount] = useState(0)

  const [currentItem, setCurrentItem] = useState(new Models.RepayPlanVo())

  const [currentDebt, setCurrentDebt] = useState<number | undefined>()

  const [currentBtnType, setCurrentBtnType] = useState<'Liquidate' | 'Repay'>()

  const [liquidateModalOpen, setLiquidateModalOpen] = useState(false)

  async function fetchData() {
    if (loading)
      return

    setLoading(true)

    try {
      const res = await RepayPlanService.ApiRepayPlanPageInfo_GET(chainId, {
        ...pagination,
        page: (pagination.page ?? 0) + 1,
        tradeId: Number(tradeId),
      })
      if (res) {
        setResult(prevResult => ({
          ...res,
          records: [...(prevResult?.records || []), ...(res.records || [])],
        }))

        setPagination(prevPagination => ({
          ...prevPagination,
          page: (prevPagination.page ?? 0) + 1,
          tradeId: Number(tradeId),
        }))
      }
    }
    catch (error) {
      console.error('[Error]:', error)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // if (tradeId)
    // if (tradeId || lendState === 'PaidOff')
    fetchData()
  }, [tradeId, refundPoolAddress, lendState])

  useEffect(() => {
    async function fetchData() {
      if (!tradeId || !browserContractService)
        return
      const processCenterContract = await browserContractService.getProcessCenterContract()

      const count = await processCenterContract.getOrderReapyMoney(tradeId)

      if (count)
        setArrears(ethers.formatUnits(count))
    }

    fetchData()
  }, [browserContractService, tradeId])

  async function onConfirm() {
    if (!tradeId)
      return

    setConfirmLoading(true)

    try {
      // if (currentItem.state === 'OVERDUE') {
      //   // TODO: Token
      //   if (repayCount > 1)
      //     await browserContractService?.capitalPool_clearingMoney(import.meta.env.VITE_FOLLOW_TOKEN, tradeId)
      //   else
      //     await browserContractService?.capitalPool_singleClearing(tradeId)
      //   console.log('%c [ repay ]-104', 'font-size:13px; background:#eb963e; color:#ffda82;', 'repay')
      // }
      // else
      if (currentBtnType === 'Repay') {
        console.log('%c [ capitalPool_repay ]-115', 'font-size:13px; background:#8da9a4; color:#d1ede8;')
        await browserContractService?.followRouter_doRepay(tradeId)
      }
      else {
        console.log('%c [ Clearing ]-120', 'font-size:13px; background:#4857e6; color:#8c9bff;')
        if (repayCount > 1)
          await browserContractService?.capitalPool_multiLiquidate(tradeId)
        else
          await browserContractService?.capitalPool_singleLiquidate(tradeId)
      }

      message.success('Succeed')
    }
    catch (error) {
      setConfirmLoading(false)
      console.log('%c [ error ]-105', 'font-size:13px; background:#46bcdf; color:#8affff;', error)
    }
    finally {
      setConfirmLoading(false)
    }
  }

  async function onOpenModal(item: Models.RepayPlanVo, type: 'Liquidate' | 'Repay') {
    setCurrentBtnType(type)
    if (!tradeId)
      return

    // setModalLoading(true)

    try {
      if (type === 'Repay' && item.state === 'OVERDUE_ARREARS') {
        const processCenterContract = await browserContractService?.getProcessCenterContract()

        const count = await processCenterContract?.getTradeIdToEveryMultiFee(tradeId)

        setCurrentDebt(Number(count)) // TODO Loading
      }
      setCurrentItem(item)
      setIsModalOpen(true)
    }
    catch (error) {
      console.log('%c [ error ]-129', 'font-size:13px; background:#719d7d; color:#b5e1c1;', error)
    }
    finally {
      // setIsModalOpen(false)
      // setModalLoading(false)
    }
  }

  dayjs()

  return (
    <div>
      <SModal open={isModalOpen} content={
        <div>
          <h2> {currentBtnType} </h2>
          <div className='flex items-center justify-between text-center'>
            {currentItem.state === 'REPAID'
              ? <div>
                <InputNumber
                  value={supplyAmount}
                  onChange={value => setSupplyAmount(value ?? 0)}
                  className='w-full'
                  min={1}
                />
              </div>
              : <h2>
                {/* {currentDebt ?? (BigNumber((currentItem.repayFee as unknown as string)).div(BigNumber(10).pow(18)).toNumber())} */}
                {arrears}
              </h2>}
          </div>
        </div>
      }
        okText="Confirm"
        onOk={onConfirm}
        onCancel={() => setIsModalOpen(false)}
        okButtonProps={{ type: 'primary', className: 'primary-btn', disabled: confirmLoading }}
      >
      </SModal>

      <Liquidate open={liquidateModalOpen}
        setOpen={setLiquidateModalOpen}
        tradeId={Number(tradeId)}
        installments={repayCount}
      ></Liquidate>

      <div className=''>
        <div className='items-end gap-4 sm:flex'>
          <div className='w-280 items-center text-24 font-400 md:text-32'>
            Repayment Plan
          </div>
          <div className='flex items-center text-center c-#D1D1D1 max-sm:my-10 md:mx-10'>
            <div className='mr-10 text-18 font-semibold'>Address:</div>
            <Address address={refundPoolAddress ?? ''} />
          </div>
          <div className='flex items-end text-center c-#D1D1D1 max-sm:my-10 md:ml-10'>
            <div className='mr-10 text-18 font-semibold'>Arrears:</div>
            <div className='text-18'>${Number(Number(arrears).toFixed(2)).toLocaleString()}</div>
          </div>
        </div>
      </div>
      <div className='h-30'></div>
      <div className='max-md:hidden'>
        <ul className='grid grid-cols-6 list-none ps-0 c-#666873 lg:px-20'>
          <li>Time</li>
          <li>Installment amount</li>
          <li>Status</li>
          <li>Overdue Days</li>
          <li className='col-span-2 flex justify-center'>Action</li>
        </ul>
        <div
          id="scrollableDivPlan"
          style={{
            // height: 400,
            overflow: 'auto',
          }}
        >
          <InfiniteScroll
            dataLength={result?.records?.length ?? 0}
            next={fetchData}
            hasMore={(result?.records?.length ?? 0) < (result?.total ?? 0)}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            scrollableTarget="scrollableDivPlan"
          >
            <List
              dataSource={result?.records}
              split={false}
              renderItem={
                (item, index) => (
                  <List.Item key={item.loanId} style={{ paddingTop: 3, paddingBottom: 3 }}>
                    <ul className='grid grid-cols-6 h68 w-full list-none items-center rounded-11 bg-#171822 ps-0 lg:px-20'>

                      <li>{index + 1}. {item.repayTime}</li>

                      <li>$ {item.repayFee && toCurrencyString(Number(ethers.formatUnits(item.repayFee)))}</li>

                      {/* <li className='truncate'>{item.state === 'OVERDUE_ARREARS' ? 'Arrears' : item.state}</li> */}
                      <li className='truncate'>{
                        dayjs(item.repayTime).isAfter(dayjs()) || item.state === 'UNPAID'
                          ? 'Not Due'
                          : item.state === 'REPAID' || item.state === 'OVERDUE_REPAID'
                            ? 'Repaid'
                            : item.state === 'OVERDUE_ARREARS'
                              ? 'Arrears'
                              : 'Overdue'
                      }</li>

                      <li>{(item.state === 'OVERDUE' || item.state === 'OVERDUE_ARREARS') && item.repayTime && calculateOverdueDays(item.repayTime)}</li>

                      <li className='col-span-2 flex flex justify-center'>
                        {/* <Button loading={modalLoading} type='primary' onClick={() => onOpenModal(item, 'Liquidate')}
                          disabled={dayjs(item.repayTime).isAfter(dayjs()) || item.state === 'UNPAID' || item.state === 'REPAID' || item.state === 'OVERDUE_REPAID'}
                          className='h30 w120 b-rd-30 primary-btn'>Liquidate</Button> */}
                        <Button loading={modalLoading} type='primary' onClick={() => setLiquidateModalOpen(true)}
                          disabled={dayjs(item.repayTime).isAfter(dayjs()) || item.state === 'UNPAID' || item.state === 'REPAID' || item.state === 'OVERDUE_REPAID'}
                          className='h30 w120 b-rd-30 primary-btn'>liquidate</Button>
                        {/* {
                          item.state === 'OVERDUE_ARREARS' && <Button loading={modalLoading} onClick={() => onOpenModal(item, 'Repay')}
                            className='ml-10 h30 w120 b-rd-30 primary-btn'>Repay</Button>
                        } */}
                        <Button loading={modalLoading} type='primary' onClick={() => onOpenModal(item, 'Repay')}
                          disabled={dayjs(item.repayTime).isAfter(dayjs()) || item.state === 'UNPAID' || item.state === 'REPAID' || item.state === 'OVERDUE_REPAID'}
                          className='ml-10 h30 w120 b-rd-30 primary-btn'>Repay</Button>
                      </li>
                    </ul>
                  </List.Item>
                )}
            />
          </InfiniteScroll>
        </div>
      </div>
      <div className='md:hidden'>
        <div
          id="scrollableDivPlan"
          style={{
            // height: 400,
            overflow: 'auto',
          }}
        >
          <InfiniteScroll
            dataLength={result?.records?.length ?? 0}
            next={fetchData}
            hasMore={(result?.records?.length ?? 0) < (result?.total ?? 0)}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            scrollableTarget="scrollableDivPlan"
          >
            <List
              dataSource={result?.records}
              split={false}
              renderItem={(item, index) => (
                <List.Item key={item.loanId} style={{ paddingTop: 3, paddingBottom: 3 }}>
                  <div key={index} className='items-between h-150 w-full flex flex-col border-2 border-#2d2f3d rounded-20 border-solid px-20 py-20 text-14'>
                    {/* <ul className='h68 w-full list-none items-center rounded-11 bg-#171822'> */}
                    <div className='my-4 flex grow justify-between text-15 font-bold'>
                      <div>Time:</div>
                      <div>{item.repayTime}</div>
                    </div>
                    <div className='my-4 flex grow justify-between'>
                      <div className='text-left'>Installment amount:</div>
                      <div className='text-right'>${item.repayFee && toCurrencyString(Number(ethers.formatUnits(item.repayFee)))}</div>
                    </div>
                    <div className='my-4 flex grow justify-between'>
                      <div className='text-left'>Status:</div>
                      <div className='text-right'>{item.state === 'OVERDUE_ARREARS' ? 'Arrears' : item.state}</div>
                    </div>
                    <div className='my-4 flex grow justify-between'>
                      <div className='text-left'>Overdue Days:</div>
                      <div className='text-right'>{(item.state === 'OVERDUE' || item.state === 'OVERDUE_ARREARS') && item.repayTime && calculateOverdueDays(item.repayTime)}</div>
                    </div>
                    <div className='my-4 flex grow justify-end'>
                      <Button loading={modalLoading} onClick={() => onOpenModal(item, 'Liquidate')}
                        className='h30 w80 b-rd-30 primary-btn'>Liquidate</Button>
                      {item.state === 'OVERDUE_ARREARS' && <Button loading={modalLoading} onClick={() => onOpenModal(item, 'Repay')}
                        className='ml-30 h30 w80 b-rd-30 primary-btn'>Repay</Button>}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </InfiniteScroll>
        </div>
      </div>
    </div>
  )
}

export default RepaymentPlan
