import { useEffect, useState } from 'react'
import { Divider, List, Skeleton } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useNavigate } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'react-i18next'
import LendTransparentCard from './components/LendTransparentCard'
import { Models } from '@/.generated/api/models'
import useUserStore from '@/store/userStore'
import { MarketBalanceService } from '@/.generated/api'

const MyLend = () => {
  const { activeUser } = useUserStore()

  const { t } = useTranslation()

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [lendOrderVOList, setLendOrderVO] = useState<Models.MyFollowVo[]>([])

  const [total, setTotal] = useState<number | undefined>()

  const [page, setPage] = useState(0)

  const loadMoreData = async () => {
    if (loading)
      return

    setLoading(true)

    if (!activeUser.id)
      return

    const params = new Models.ApiMarketBalancePageMyFollowGETParams()

    params.limit = 4
    params.page = page + 1

    params.userId = BigNumber(activeUser.id).toNumber()
    params.loanId = undefined

    try {
      const res = await MarketBalanceService.ApiMarketBalancePageMyFollow_GET(params)

      if (res?.records && res.records.length > 0) {
        setTotal(res.total)

        setLendOrderVO((prevData) => {
          // const uniqueRecords = res?.records?.filter((newRecord) => {
          //   return !prevData.some(existingRecord => existingRecord.loan?.tradeId === newRecord.loan?.tradeId)
          // })

          return [...prevData, ...res?.records ?? []]
        })

        setPage(page + 1)
      }
    }
    catch (error) {
      console.log('%c [ error ]-61', 'font-size:13px; background:#b962c5; color:#fda6ff;', error)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMoreData()
  }, [activeUser.id])

  return (
    <div>
      <div
        id="scrollableDiv"
        style={{
          overflow: 'auto',
        }}
      >
        <InfiniteScroll
          dataLength={lendOrderVOList?.length ?? 0}
          next={loadMoreData}
          hasMore={(total !== undefined) && (lendOrderVOList.length < total)}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={<Divider plain>{`${t('personal.myLend.endMessage')}`}</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={lendOrderVOList}
            renderItem={item => (
              <List.Item key={item.loanId} onClick={() =>
                navigate(`/loan-details/?prePage=lend&userId=${item.borrowUserId}&tradeId=${item.loan?.tradeId}`)}>
                <LendTransparentCard item={item ?? new Models.MyFollowVo()} >
                </LendTransparentCard>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default MyLend
