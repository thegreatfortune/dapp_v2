import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Button, InputNumber, List, Skeleton, message } from 'antd'
import { ethers } from 'ethers'
import dayjs from 'dayjs'
import { RepayPlanService } from '../../../../.generated/api/RepayPlan'
import Address from './Address'
import { Models } from '@/.generated/api/models'
import SModal from '@/pages/components/SModal'
import useBrowserContract from '@/hooks/useBrowserContract'

interface IProps {
  tradeId: bigint | null
  repayCount: number
  refundPoolAddress: string | undefined
  lendState: 'Processing' | 'Success' | undefined
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
  const { browserContractService } = useBrowserContract()

  const [pagination, setPagination] = useState<Models.ApiRepayPlanPageInfoGETParams>({
    ...new Models.ApiRepayPlanPageInfoGETParams(),
    limit: 10,
    page: 0,
  })
  const [result, setResult] = useState(new Models.PageResult<Models.RepayPlanVo>())
  const [loading, setLoading] = useState(false)

  const [modalLoading, setModalLoading] = useState(false)

  const [confirmLoading, setConfirmLoading] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [arrears, setArrears] = useState<string>('0')

  const [supplyAmount, setSupplyAmount] = useState(0)

  const [currentItem, setCurrentItem] = useState(new Models.RepayPlanVo())

  const [currentDebt, setCurrentDebt] = useState<number | undefined>()

  const [currentBtnType, setCurrentBtnType] = useState<'Liquidation' | 'Repayment'>()

  async function fetchData() {
    if (loading)
      return

    setLoading(true)

    try {
      const res = await RepayPlanService.ApiRepayPlanPageInfo_GET({
        ...pagination,
        page: (pagination.page ?? 0) + 1,
        tradeId: Number(tradeId),
      })

      if (res) {
        setResult(prevResult => ({
          ...res,
          records: [...(prevResult.records || []), ...(res.records || [])],
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
    if (tradeId || lendState === 'Success')
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
      if (currentBtnType === 'Repayment') {
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

  async function onOpenModal(item: Models.RepayPlanVo, type: 'Liquidation' | 'Repayment') {
    setCurrentBtnType(type)

    if (!tradeId)
      return

    setModalLoading(true)

    try {
      if (type === 'Repayment' && item.state === 'OVERDUE_ARREARS') {
        const processCenterContract = await browserContractService?.getProcessCenterContract()

        const count = await processCenterContract?.getTradeIdToEveryMultiFee(tradeId)

        setCurrentDebt(Number(count)) // TODO Loading
      }

      setIsModalOpen(true)
      setCurrentItem(item)
    }
    catch (error) {
      console.log('%c [ error ]-129', 'font-size:13px; background:#719d7d; color:#b5e1c1;', error)
    }
    finally {
      setIsModalOpen(false)
      setModalLoading(false)
    }
  }

  return (
    <div>
      <SModal open={isModalOpen} content={
        // <div>
        //   <Button onClick={() => setIsModalOpen(false)}>
        //     Cancel
        //   </Button>
        //   <Button type='primary' onClick={onConfirm} loading={confirmLoading}>
        //     Confirm
        //   </Button>
        // </div>
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

      <div className='flex items-center gap-4'>
        <span className='text-32 font-400'>Repayment Plan</span>

        <div className='mx-20 flex items-center text-center c-#D1D1D1'>
          <div className='mr-10 text-20 font-semibold'>Address:</div>
          <Address address={refundPoolAddress ?? ''} />
        </div>
        <div className='mx-20 flex items-center text-center c-#D1D1D1'>
          <div className='mr-10 text-20 font-semibold'>Arrears:</div>
          <div className='text-30'>${Number.parseFloat(arrears).toLocaleString()}</div>
        </div>

      </div>

      <ul className='grid grid-cols-5 list-none c-#666873'>
        <li>TIME</li>
        <li>Repayment Amount</li>
        <li>Status</li>
        <li>Overdue days</li>
      </ul>

      <span className='c-red'>
      </span>

      <div
        id="scrollableDivPlan"
        style={{
          height: 400,
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
            dataSource={result.records}
            split={false}
            renderItem={(item, index) => (
              <List.Item key={item.loanId} style={{ paddingTop: 3, paddingBottom: 3 }}>
                <ul className='grid grid-cols-5 h68 w-full list-none items-center gap-4 rounded-11 bg-#171822'>
                  <li className='relative'><span className='absolute left--22'>{index + 1}</span> {item.repayTime}</li>
                  <li>${item.repayFee && ethers.formatUnits(item.repayFee)}</li>

                  <li>{item.state}</li>
                  <li>{(item.state === 'OVERDUE' || item.state === 'OVERDUE_ARREARS') && item.repayTime && calculateOverdueDays(item.repayTime)}</li>
                  <li>
                    <div className='flex'>
                      <Button loading={modalLoading} onClick={() => onOpenModal(item, 'Liquidation')} className='m-8 h40 w180 b-rd-30 primary-btn'>Liquidate</Button>
                      {item.state === 'OVERDUE_ARREARS' && <Button loading={modalLoading} onClick={() => onOpenModal(item, 'Repayment')} className='m-8 h40 w180 b-rd-30 primary-btn'>Repay</Button>}
                    </div>
                  </li>
                </ul>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default RepaymentPlan
