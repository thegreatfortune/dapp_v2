import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Button, Divider, InputNumber, List, Skeleton, message } from 'antd'
import BigNumber from 'bignumber.js'
import { RepayPlanService } from '../../../../.generated/api/RepayPlan'
import { Models } from '@/.generated/api/models'
import SModal from '@/pages/components/SModal'
import useBrowserContract from '@/hooks/useBrowserContract'

interface IProps {
  tradeId: bigint | null
}

const RepaymentPlan: React.FC<IProps> = ({ tradeId }) => {
  const { browserContractService } = useBrowserContract()

  const [pagination, setPagination] = useState({
    ...new Models.ApiRepayPlanPageInfoGETParams(),
    limit: 3,
    page: 0,
  })
  const [result, setResult] = useState(new Models.PageResult<Models.RepayPlanVo>())
  const [loading, setLoading] = useState(false)

  const [modalLoading, setModalLoading] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [arrears, setArrears] = useState(0)

  const [currentItem, setCurrentItem] = useState(new Models.RepayPlanVo())

  async function fetchData() {
    if (loading)
      return

    setLoading(true)

    try {
      const res = await RepayPlanService.ApiRepayPlanPageInfo_GET({
        ...pagination,
        page: pagination.page + 1,
        tradeId: Number(tradeId),
      })

      if (res) {
        console.log('%c [ res ]-34', 'font-size:13px; background:#83d80f; color:#c7ff53;', res)
        setResult(prevResult => ({
          ...res,
          records: [...(prevResult.records || []), ...(res.records || [])],
        }))

        setPagination(prevPagination => ({
          ...prevPagination,
          page: prevPagination.page + 1,
          loanId: Number(tradeId),
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
    if (tradeId)
      fetchData()

    // return () => {
    //   // Perform cleanup if needed
    //   // This will be called when the component unmounts
    // }
  }, [tradeId])

  useEffect(() => {
    async function fetchData() {
      if (!tradeId || !browserContractService)
        return
      const getProcessCenterContract = await browserContractService.getProcessCenterContract()

      const count = await getProcessCenterContract.getOrderReapyMoney(tradeId)

      if (count)
        setArrears(Number(count))
    }

    fetchData()
  }, [browserContractService, tradeId])

  async function onConfirm() {
    if (!tradeId)
      return

    setModalLoading(true)

    if (currentItem.state === 'OVERDUE') {
      try {
        const res = await browserContractService?.capitalPool_repay(tradeId)
        message.error('succeed')

        console.log('%c [ res ]-81', 'font-size:13px; background:#bc5629; color:#ff9a6d;', res)
      }
      catch (error) {
        message.error('operation failure')

        console.log('%c [ error ]-82', 'font-size:13px; background:#50a27f; color:#94e6c3;', error)
      }
    }
    else {
      try {
        const res = await browserContractService?.capitalPool_clearingMoney(import.meta.env.VITE_FOLLOW_TOKEN, tradeId)
        message.error('succeed')

        console.log('%c [ res ]-81', 'font-size:13px; background:#bc5629; color:#ff9a6d;', res)
      }
      catch (error) {
        message.error('operation failure')

        console.log('%c [ error ]-82', 'font-size:13px; background:#50a27f; color:#94e6c3;', error)
      }
    }

    setModalLoading(false)
  }

  function onOpenModal(item: Models.RepayPlanVo) {
    setIsModalOpen(true)

    setCurrentItem(item)
  }

  return (
        <div>
            <SModal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={
                <div>
                    <Button onClick={() => setIsModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button type='primary' onClick={onConfirm} loading={modalLoading}>
                        Confirm
                    </Button>
                </div>}>
                <div>
                    <h1>Repayment</h1>
                    <div className='flex items-center justify-between text-center'>
                        <h2>{BigNumber((currentItem.repayFee as unknown as string)).div(BigNumber(10).pow(18)).toNumber()}    </h2>
                        {/* <InputNumber
                            value={currentDue}
                            className='w-full'
                            min={1}
                        /> */}

                    </div>
                </div>
            </SModal>

            <h2>Repayment Plan</h2>

            {arrears !== 0 ? <span>Arrears ${BigNumber(arrears).div(BigNumber(10).pow(18)).toFixed(2)}</span> : null}

            <ul className='flex list-none gap-x-168'>
                <li>TEMI</li>
                <li>Repayment Amount</li>
                <li>State</li>
                <li>Days Overdue</li>
                {/* <li>Remaining Amount Due</li> */}
            </ul>

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
                                    <li>{BigNumber(item.repayFee ?? 0).div(BigNumber(10).pow(18)).toFixed(2)}</li>
                                    <li>{item.state}</li>
                                    <li>compute</li>
                                    <li>{item.nowCount}</li>
                                    <li><Button onClick={() => onOpenModal(item) } className='h30 w134 primary-btn'>{item.state === 'REPAID' ? 'Award' : 'Repayment'}</Button></li>
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
