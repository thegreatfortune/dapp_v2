import { useEffect, useState } from 'react'
import { Button, Divider, List, Skeleton } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LoanService } from '@/.generated/api/Loan'
import { Models } from '@/.generated/api/models'
import useUserStore from '@/store/userStore'
import TransparentCard from '@/pages/components/TransparentCard'

const MyLoan = () => {
  const { activeUser } = useUserStore()

  const navigate = useNavigate()

  const { t } = useTranslation()

  const [loading, setLoading] = useState(false)

  const [loanOrderVOList, setLoanOrderVO] = useState<Models.LoanOrderVO[]>([])

  const [total, setTotal] = useState<number | undefined>()

  const [page, setPage] = useState(0)

  const loadMoreData = async () => {
    // if (loading)
    //   return

    setLoading(true)
    console.log('%c [ pre ]-44', 'font-size:13px; background:#57ef71; color:#9bffb5;')

    console.log('%c [ activeUser ]-34', 'font-size:13px; background:#d43f2b; color:#ff836f;', activeUser)

    if (!activeUser.id)
      return

    console.log('%c [ before ]-44', 'font-size:13px; background:#57ef71; color:#9bffb5;')

    const params = new Models.ApiLoanPageLoanContractGETParams()

    params.limit = 4
    params.page = page + 1 // Increment the page

    params.borrowUserId = String(activeUser.id)

    try {
      const res = await LoanService.ApiLoanPageLoanContract_GET(params)

      if (res?.records && res.records.length > 0) {
        setTotal(res.total)

        setLoanOrderVO((prevData) => {
          const uniqueRecords = res?.records?.filter((newRecord) => {
            return !prevData.some(existingRecord => existingRecord.tradeId === newRecord.tradeId)
          })

          return [...prevData, ...uniqueRecords ?? []]
        })

        setPage(page + 1)
      }
    }
    catch (error) {
      // Handle error
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
          height: 400,
          overflow: 'auto',
        }}
      >
        <InfiniteScroll
          dataLength={total ?? 0}
          next={loadMoreData}
          hasMore={(total !== undefined) && (loanOrderVOList.length < total) }
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={<Divider plain>{`${t('personal.myLoan.endMessage')}`}</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
          grid={{ gutter: 16, column: 4 }}
            dataSource={loanOrderVOList}
            renderItem={item => (
              <List.Item key={item.id} onClick={() => navigate(`/loan-details/?prePage=loan&tradeId=${item.tradeId}`)}>
                <TransparentCard item={item} btnText='Repayment' >
                <Button className='h30 w-110 primary-btn' >{`${t('personal.myLoan.button')}`}</Button>
              </TransparentCard>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default MyLoan
