import { useState } from 'react'
import { Checkbox } from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import { orderBy } from 'lodash-es'
import type { ListGridType } from 'antd/es/list'
import { Models } from '@/.generated/api/models'
import type { IColumn } from '@/pages/components/ScrollabletList'
import ScrollableList from '@/pages/components/ScrollabletList'
import { MarketService } from '@/.generated/api/Market'
import type { User } from '@/models/User'

interface IProps {
  renderItem: (params: any, index: number) => React.ReactNode
  tradeId: number
  activeUser: User
  grid?: ListGridType
  containerId: string
}

const SorterScrollableList: React.FC<IProps> = ({ grid, activeUser, renderItem, tradeId, containerId }) => {
  const [params] = useState({ ...new Models.ApiMarketPageInfoGETParams(), ...{ limit: 8, page: 1 }, orderItemList: 'price=false', state: 'ToBeTraded', tradeId, loanId: undefined, marketId: undefined })

  const quantitySorter = (imageIndex: number, data: Models.TokenMarketVo[]): Models.TokenMarketVo[] => {
    let sortDirection

    imageIndex === 0 && (sortDirection = 'asc')
    imageIndex === 1 && (sortDirection = 'desc')

    if (!sortDirection)
      return data

    return orderBy(
      data,
      ['remainingQuantity'],
      [sortDirection as any],
    )
  }

  const totalPriceSorter = (imageIndex: number, data: Models.TokenMarketVo[]): Models.TokenMarketVo[] => {
    let sortDirection

    imageIndex === 0 && (sortDirection = 'asc')
    imageIndex === 1 && (sortDirection = 'desc')

    if (!sortDirection)
      return data

    return orderBy(
      data,
      ['price'],
      [sortDirection as any],
    )
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
    // render(item) {
    //   return <span>{dayjs(item.depositeTime).format('YYYY-MM-DD mm:ss')}</span>
    // },
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
      <ScrollableList grid={grid} columns={columns} api={MarketService.ApiMarketPageInfo_GET} params={params} containerId={containerId} renderItem={renderItem} />
  )
}

export default SorterScrollableList
