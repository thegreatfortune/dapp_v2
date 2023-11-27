import { Divider, List, Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import type { Models } from '@/.generated/api/models'

interface IPaged {
  page: number
  limit: number
}

interface IProps {
  api: (params: IPaged) => Promise<Models.PageResult<any>>
  params: IPaged & any
  renderItem: (item: any) => React.ReactNode
  containerId: string
}

const ScrollableRepaymentList: React.FC<IProps> = ({ api, params, renderItem, containerId = 'containerId' }) => {
  const [result, setResult] = useState<Models.PageResult<any>>({
    total: 0,
    records: [],
  })

  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<number>(params.page)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await api({ ...params, page })

      setResult(prevResult => ({
        ...prevResult,
        ...res,
      }))
    }
    catch (error) {
      console.error('[Error]:', error)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [params])

  const handleLoadMore = async () => {
    setPage(prevPage => prevPage + 1)
    await fetchData()
  }

  return (
    <div
      id={containerId}
      style={{
        height: 400,
        overflow: 'auto',
        padding: '0 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)',
      }}
    >
      <InfiniteScroll
        dataLength={result.total ?? 0}
        next={handleLoadMore}
        hasMore={(result?.records?.length ?? 0) < (result?.total ?? 0)}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget={containerId}
      >
        <List
          dataSource={result.records}
          renderItem={item => (
            <List.Item key={(item as any).loanId}>
              {renderItem(item)}
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  )
}

export default ScrollableRepaymentList
