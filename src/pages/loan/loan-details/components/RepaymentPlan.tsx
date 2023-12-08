import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Button, Divider, InputNumber, List, Skeleton, message } from 'antd'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { RepayPlanService } from '../../../../.generated/api/RepayPlan'
import { Models } from '@/.generated/api/models'
import SModal from '@/pages/components/SModal'
import useBrowserContract from '@/hooks/useBrowserContract'

interface IProps {
  tradeId: bigint | null
  repayCount: number
  refundPoolAddress: string | undefined
  lendState: 'Processing' | 'Success' | undefined
}

const RepaymentPlan: React.FC<IProps> = ({ tradeId, repayCount, refundPoolAddress, lendState }) => {
  const { browserContractService } = useBrowserContract()

  const [pagination, setPagination] = useState<Models.ApiRepayPlanPageInfoGETParams>({
    ...new Models.ApiRepayPlanPageInfoGETParams(),
    limit: 3,
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
      if (currentItem.state === 'OVERDUE_ARREARS') {
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
      message.error('operation failure')
      console.log('%c [ error ]-105', 'font-size:13px; background:#46bcdf; color:#8affff;', error)
    }
    finally {
      setConfirmLoading(false)
    }
  }

  async function onOpenModal(item: Models.RepayPlanVo, type: string) {
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
      setModalLoading(false)
    }
  }

  return (
    <div>
      <SModal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={
        <div>
          <Button onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button type='primary' onClick={onConfirm} loading={confirmLoading}>
            Confirm
          </Button>
        </div>}>
        <div>
          <h1> {currentItem.state === 'OVERDUE_ARREARS' ? 'Repayment' : 'Liquidation'} </h1>

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
      </SModal>

      <div className='flex items-center'>
        <h2>Repayment Plan</h2>

        <span className='mx-20'>{refundPoolAddress}</span>

        Arrears $ {arrears}
      </div>

      <ul className='flex list-none gap-x-168'>
        <li>TIME</li>
        <li>Repayment Amount</li>
        <li>State</li>
        <li>Days Overdue</li>
        {/* <li>Remaining Amount Due</li> */}
      </ul>
      <span className='c-red'>
      </span>

      <div
        id="scrollableDivPlan"
        style={{
          height: 400,
          overflow: 'auto',
          padding: '0 16px',
          border: '1px solid rgba(140, 140, 140, 0.35)',
        }}
      >
        <InfiniteScroll
          dataLength={result.total ?? 0}
          next={fetchData}
          hasMore={(result?.records?.length ?? 0) < (result?.total ?? 0)}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDivPlan"
        >
          <List
            dataSource={result.records}
            renderItem={item => (
              <List.Item key={item.loanId}>
                <ul className='flex list-none gap-x-168'>
                  <li>{item.nowCount} {item.repayTime}</li>
                  {/* <li>{item.nowCount} {dayjs(item.repayTime).format('YYYY-MM-DD HH:mm:ss')}</li> */}
                  <li>{item.repayFee && ethers.formatUnits(BigInt(item.repayFee))}</li>
                  <li>{item.state}</li>
                  <li>compute</li>
                  <li>
                    <Button loading={modalLoading} onClick={() => onOpenModal(item, 'Liquidation')} className='h30 w134 primary-btn'>Liquidation</Button>

                    {item.state === 'OVERDUE_ARREARS' && <Button loading={modalLoading}onClick={() => onOpenModal(item, 'Repayment')} className='h30 w134 primary-btn'>Repayment</Button>}

                    {/* {item.state === 'OVERDUE'
                      ? <Button onClick={() => onOpenModal(item)} className='h30 w134 primary-btn'>Liquidation</Button>
                      : item.state === 'OVERDUE_ARREARS'
                        ? <Button onClick={() => onOpenModal(item)} className='h30 w134 primary-btn'>Repayment</Button>
                        : null} */}
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
