import { Divider, List, Skeleton } from 'antd'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import type { ListGridType } from 'antd/es/list'
import { useNavigate } from 'react-router-dom'

// import TransparentCard from '../TransparentCard'
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
  grid?: ListGridType
}

interface DataType {
  'showPlatformUserList': string
  'collectCopies': number
  'createDate': string
  'userInfo': {
    'nickName': string
    'address': string
    'platformName': string
    'pictureUrl': string
    'inviteCode': string
    'userId': string
    'creditScore': number
  }
  'tradeId': number
  'state': string
  'tradingPlatform': string
  'tradingForm': string
  'loanName': string
  'picUrl': string
  'loanMoney': string
  'interest': number
  'repayCount': number
  'periods': number
  'goalCopies': number
  'minGoalQuantity': number
  'collectEndTime': number
  'dividendRatio': number
  'transactionPairs': string
  'usageIntro': string
  'endTime': number
  'isConfirm': boolean
}

const ScrollableList: React.FC<IScrollableListProps> = ({ columns, className, api, params, renderItem, containerId = 'containerId', grid }) => {
  const [originalData, setOriginalData] = useState<DataType[]>(
    // {
    // const [originalData, setOriginalData] = useState<Models.PageResult<{ total: number; records: any[] }>>({
    // total: 0,
    // records: [],
    [],
    // }
  )

  // const [result, setResult] = useState<Models.PageResult<{ total: number; records: any[] }>>({
  //   total: 0,
  //   records: [],
  // })
  const navigate = useNavigate()

  const [data, setData] = useState<DataType[]>([])

  // const [loading, setLoading] = useState(false)

  const [page, setPage] = useState<number>(1)

  const [hasMore, setHasMore] = useState(true)

  const fetchData = async (cPage: number = 1) => {
    try {
      // setLoading(true)
      const res = await api({ ...params, page: cPage })

      if (res.current! * res.size! < res.total!)
        console.log(true)
      else
        setHasMore(false)

      // setResult(prevResult => ({
      //   ...prevResult,
      //   total: res.total,
      //   records: cPage > 1
      //     ? [...(prevResult.records ?? []), ...(res?.records ?? [])]
      //     : res?.records ?? [],
      // }))

      setData([...data, ...res.records as DataType[]])
    }
    catch (error) {
      console.error('[Error]:', error)
    }
    // setPage(prevPage => prevPage + 1)
    // finally {
    //   setLoading(false)
    // }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const resetData = (): void => {
    setData(prevResult => ({
      ...prevResult,
      ...originalData,
    }))
  }

  const handleLoadMore = async () => {
    await fetchData(page + 1)
    setPage(prevPage => prevPage + 1)
  }

  function onSorter<T>(imgIndex: number, data: T[], callback: <T>(imageIndex: number, data: T[],) => T[]) {
    const res = callback(imgIndex, data) as any

    if (imgIndex === 2) {
      resetData()
    }
    else
      if (res) {
        setData(prevResult => ({
          ...prevResult,
          ...res,
        }))
      }
  }

  function columnRenderCallback<T>(data: T[], isRestData?: boolean) {
    if (isRestData) {
      resetData()
    }
    else if (data) {
      // setData(prevResult => ({
      //   ...prevResult,
      //   ...data,
      // }))
    }
  }

  const insideColumnRenderItem = () => {
    return (
      <ul className='grid grid-cols-6 list-none gap-x-168'>
        {columns?.map((e, i) => <li className='w-168' key={e.key}>{e.render
          ? <span key={e.key}>{e.render(e, data!, columnRenderCallback)}</span>
          : <span key={e.key}>{e.sorter && e.onSorter
            ? <Title onSorter={imgIndex => onSorter(imgIndex, data!, e.onSorter!)} title={e.title} />
            : e.title} + '123123'</span>}
        </li>)}
      </ul>
    )
  }

  return (
    <div className='w-full'>
      {/* {columns && insideColumnRenderItem()} */}
      <div
        id={containerId}
        className={`${className}`}
      >
        <InfiniteScroll
          dataLength={(page + 1) * 16}
          next={(handleLoadMore)}
          hasMore={hasMore}
          loader={
            <List
              grid={grid}
              dataSource={[0, 0, 0, 0]}
              renderItem={() => (
                <List.Item style={{ paddingTop: 20, paddingBottom: 3 }} className='grid grid-cols-4 w-full'>
                  <Skeleton paragraph={{ rows: 2 }} active />
                </List.Item>
              )}
            >
            </List>
          }
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        // scrollableTarget={containerId}
        >
          {
            grid
              ? <div className='flex flex-wrap gap-16'>
                {
                  data.map((item, index) => {
                    return renderItem(item, index)
                  })
                }
              </div>
              // ? <List
              //   split={false}
              //   grid={grid}
              //   dataSource={data}
              //   renderItem={(item, index) => (
              //     <List.Item style={{ paddingTop: 3, paddingBottom: 3 }}
              //     >
              //       {renderItem(item, index)}
              //     </List.Item>
              //   )}
              // />
              : <List
                split={false}
                dataSource={data}
                renderItem={(item, index) => (
                  <List.Item style={{ paddingTop: 3, paddingBottom: 3 }} className='w-full ps-0'>
                    {renderItem(item, index)}
                  </List.Item>
                )}
              />
          }

        </InfiniteScroll>
      </div >
    </div >
  )
}

export default ScrollableList
