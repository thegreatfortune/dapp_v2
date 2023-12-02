import { useState } from 'react'
import { Checkbox } from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import { Models } from '@/.generated/api/models'
import type { IColumn } from '@/pages/components/ScrollabletList'
import ScrollableList from '@/pages/components/ScrollabletList'
import { MarketService } from '@/.generated/api/Market'
import type { User } from '@/models/User'

interface IProps {
  renderItem: (params: any) => React.ReactNode
  tradeId: number
  activeUser: User
}

const SorterScrollableList: React.FC<IProps> = ({ activeUser, renderItem, tradeId }) => {
  const orderItem = new Models.OrderItem()
  orderItem.column = 'price'

  const [params] = useState({ ...new Models.ApiMarketPageInfoGETParams(), ...{ limit: 8, page: 1 }, state: 'ToBeTraded', orderItemList: encodeURIComponent(JSON.stringify([orderItem])), tradeId, loanId: undefined, marketId: undefined })

  enum SortDirection {
    DESCENDING = 'desc',
    ASCENDING = 'asc',
    ORIGINAL = 'original',
  }

  const quantitySorter = (imageIndex: number, data: Models.TokenMarketVo[]): Models.TokenMarketVo[] => {
    let sortedData: Models.TokenMarketVo[]

    switch (imageIndex as unknown as SortDirection) {
      case SortDirection.DESCENDING:
        sortedData = data.sort((a, b) => b.remainingQuantity! - a.remainingQuantity!)
        break
      case SortDirection.ASCENDING:
        sortedData = data.sort((a, b) => a.remainingQuantity! - b.remainingQuantity!)
        break
      case SortDirection.ORIGINAL:
      default:
        sortedData = [...data]
        break
    }

    return sortedData
  }

  const totalPriceSorter = (imageIndex: number, data: Models.TokenMarketVo[]): Models.TokenMarketVo[] => {
    let sortedData: Models.TokenMarketVo[]

    switch (imageIndex as unknown as SortDirection) {
      case SortDirection.DESCENDING:
        sortedData = data.sort((a, b) => Number.parseFloat(b.price !) - Number.parseFloat(a.price!))
        break
      case SortDirection.ASCENDING:
        sortedData = data.sort((a, b) => Number.parseFloat(a.price!) - Number.parseFloat(b.price!))
        break
      case SortDirection.ORIGINAL:
      default:
        sortedData = [...data]
        break
    }

    return sortedData
  }

  function onColumnCheckboxChange(state: CheckboxChangeEvent, originalData: Models.TokenMarketVo[], columnRenderCallback: (data: Models.TokenMarketVo[], resetData?: boolean) => void) {
    const checked = state.target.checked

    if (checked) {
      const filteredData = originalData.filter(item => item.userId === activeUser.id)
      columnRenderCallback(filteredData)
    }
    else {
      columnRenderCallback([], true)
    }
  }

  const [columns] = useState<IColumn<Models.TokenMarketVo>[]>([{
    title: 'TRADER',
    key: 'TRADER',
  },
  {
    title: 'Unit Price',
    key: '1',
  },
  {
    title: 'Quantity',
    sorter: true,
    onSorter: quantitySorter,
    key: '2',
  },
  {
    title: 'Total Price',
    sorter: true,
    onSorter: totalPriceSorter,
    key: '3',
  },
  {
    title: 'TIME',
    key: '4',
  },
  {
    title: 'My pending order',
    key: '5',
    render(item, data, columnRenderCallback) {
      return <Checkbox onChange={state => onColumnCheckboxChange(state, data, columnRenderCallback)}>My pending order</Checkbox>
    },
  },
  ])

  return (
    <div>
      <ScrollableList columns={columns} api={MarketService.ApiMarketPageInfo_GET} params={params} containerId='RoomTradeScrollable' renderItem={renderItem} />
    </div>
  )
}

export default SorterScrollableList
