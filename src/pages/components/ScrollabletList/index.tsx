import { Divider, List, Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Title from './Title'
import type { Models } from '@/.generated/api/models'

interface IPaged {
  page: number
  limit: number
}

export interface IColumn<T> {
  key: string
  title: string
  sorter?: boolean
  onSorter?: (imageIndex: number, data: T[]) => T[]
  render?: (item: T, dat: T[], columnRenderCallback: (data: T[], isRestData?: boolean) => void) => React.ReactNode
}

export interface IScrollableListProps {
  api: (params: IPaged) => Promise<Models.PageResult<any>>
  params: IPaged & any
  renderItem: (item: any, index: number) => React.ReactNode
  containerId: string
  className?: string
  columns?: IColumn<any>[]
}

const ScrollableList: React.FC<IScrollableListProps> = ({ columns, className, api, params, renderItem, containerId = 'containerId' }) => {
  const [originalData, setOriginalData] = useState<Models.PageResult<any>>({
    total: 0,
    records: [],
  })

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

      setOriginalData(prevResult => ({
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

  const resetData = (): void => {
    setResult(prevResult => ({
      ...prevResult,
      records: originalData.records,
    }))
  }

  const handleLoadMore = async () => {
    setPage(prevPage => prevPage + 1)
    await fetchData()
  }

  function onSorter<T>(imgIndex: number, data: T[], callback: <T>(imageIndex: number, data: T[],) => T[]) {
    const res = callback(imgIndex, data) as any

    if (imgIndex === 2) {
      resetData()
    }
    else
      if (res) {
        setResult(prevResult => ({
          ...prevResult,
          records: res,
        }))
      }
  }

  function columnRenderCallback<T>(data: T[], isRestData?: boolean) {
    if (isRestData) {
      resetData()
    }
    else if (data) {
      setResult(prevResult => ({
        ...prevResult,
        records: data,
      }))
    }
  }

  const insideColumnRenderItem = () => {
    return (
      <ul className='flex list-none gap-x-168'>
        {columns?.map((e, i) => <li key={e.key}>{e.render
          ? <span key={e.key}>{e.render(e, result.records!, columnRenderCallback)}</span>
          : <span key={e.key}>{e.sorter && e.onSorter
            ? <Title onSorter={imgIndex => onSorter(imgIndex, result.records!, e.onSorter!)} title={e.title} />
            : e.title}</span>}
        </li>)}
      </ul>
    )
  }

  return (
    <div>
      {columns && insideColumnRenderItem()}
      <div
        id={containerId}
        className={`${className} h400 overflow-auto`}
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
            split={false}
            dataSource={result.records}
            renderItem={(item, index) => (
              <List.Item style={{ paddingTop: 3, paddingBottom: 3 }}>
                {renderItem(item, index)}
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default ScrollableList
