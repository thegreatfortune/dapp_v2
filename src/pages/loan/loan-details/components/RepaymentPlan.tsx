import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Divider, List, Skeleton } from 'antd'
import { RepayPlanService } from '../../../../.generated/api/RepayPlan'
import { Models } from '@/.generated/api/models'

interface IProps {
  tradeId: bigint | null
}

const RepaymentPlan: React.FC<IProps> = ({ tradeId }) => {
  const [params, setParams] = useState({ ...new Models.ApiRepayPlanPageInfoGETParams(), limit: 3, page: 0 })
  const [result, setResult] = useState(new Models.PageResult<Models.RepayPlanVo>())
  const [loading, setLoading] = useState(false)

  async function loadMoreData() {
    if (loading)
      return

    setLoading(true)

    try {
      const res = await RepayPlanService.ApiRepayPlanPageInfo_GET({ ...params, page: params.page + 1, tradeId: Number(tradeId) })

      if (res) {
        setResult(prevResult => ({
          ...res,
          records: [...(prevResult.records || []), ...(res.records || [])],
        }))

        setParams(prevParams => ({ ...prevParams, page: prevParams.page + 1, loanId: Number(tradeId) }))
      }
    }
    catch (error) {
      console.log('%c [ error ]-30', 'font-size:13px; background:#c64c4f; color:#ff9093;', error)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!tradeId)
      return

    loadMoreData()
  }, [tradeId])

  return (
        <div>
            <h2>
                Repayment Plan
            </h2>

         <ul className='flex list-none gap-x-168'>
            <li>TEMI</li>
            <li>Repayment Amount</li>
            <li>State</li>
            <li>Days Overdue</li>
            <li>Remanining amount due</li>
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
                    next={loadMoreData}
                    hasMore={(result?.records?.length ?? 0) < (result?.total ?? 0)}
                    loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                    endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                    scrollableTarget="scrollableDivPlan"
                >
                    <List
                        dataSource={result.records}
                        renderItem={item => (
                            <List.Item key={item.loanId}>
                                <List.Item.Meta title="title" description={item.nowCount} />
                                <div>Content</div>
                            </List.Item>
                        )}
                    />
                </InfiniteScroll>
            </div>
        </div>

  )
}

export default RepaymentPlan
