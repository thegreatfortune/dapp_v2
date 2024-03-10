import { useEffect, useState } from 'react'
import { Button, Divider, List, Skeleton } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useChainId } from 'wagmi'
import { LoanService } from '@/.generated/api/Loan'
import { Models } from '@/.generated/api/models'
import useUserStore from '@/store/userStore'
import TransparentCard from '@/pages/components/TransparentCard'

const MyLoan = () => {
  const chainId = useChainId()
  const { currentUser } = useUserStore()

  const navigate = useNavigate()

  const { t } = useTranslation()

  const [loading, setLoading] = useState(false)

  const [loanOrderVOList, setLoanOrderVO] = useState<Models.ILoanOrderVO[]>([])

  const [total, setTotal] = useState<number | undefined>()

  const [page, setPage] = useState(0)

  const loadMoreData = async () => {
    // if (loading)
    //   return

    setLoading(true)

    if (!currentUser.userId)
      return

    const params = new Models.ApiLoanPageLoanContractGETParams()

    params.limit = 16
    params.page = page + 1 // Increment the page

    params.borrowUserId = String(currentUser.userId)

    try {
      const res = await LoanService.ApiLoanPageLoanContract_GET(chainId, params)

      if (res?.records && res.records.length > 0) {
        setTotal(res.total)

        setLoanOrderVO((prevData) => {
          const uniqueRecords = res?.records?.filter((newRecord) => {
            return !prevData.some(existingRecord => existingRecord.tradeId === newRecord.tradeId)
          })
          return [...prevData, ...uniqueRecords as Models.ILoanOrderVO[] ?? []]
        })
        setPage(page + 1)
      }
    }
    catch (error) {
      console.log('%c [ error ]-60', 'font-size:13px; background:#6d0066; color:#b144aa;', error)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMoreData()
  }, [currentUser.userId])

  const renderItem = (item: Models.ILoanOrderVO) => {
    return <List.Item key={item.tradeId} onClick={() => navigate(`/loan-details/?prePage=loan&tradeId=${item.tradeId}`)}>
      <TransparentCard item={item} btnText='Repay' >
        <Button className='mt-10 h30 w-110 primary-btn' >{`${t('personal.myLoan.button')}`}</Button>
      </TransparentCard>
    </List.Item>
  }

  return (
    <div className='w-full'>
      <div className='h-30'></div>
      <div className='text-28'>My Loans</div>
      <Divider></Divider>
      <div className='h-30'></div>
      <div
        id="scrollableDiv"
        style={{
          // height: 500,
          overflow: 'auto',
        }}
      >
        <InfiniteScroll
          dataLength={(page + 1) * 16}
          next={loadMoreData}
          hasMore={(total !== undefined) && (loanOrderVOList.length < total)}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={<Divider plain>{`${t('personal.myLoan.endMessage')}`}</Divider>}
          scrollableTarget="loanScrollableDiv"
        >
          <List
            grid={{ gutter: 8, column: 4, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 3 }}
            dataSource={loanOrderVOList}
            renderItem={renderItem}
          />
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default MyLoan
