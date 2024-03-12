/* eslint-disable @typescript-eslint/indent */
import { useState } from 'react'
import { useChainId } from 'wagmi'
import { IntegralRecordService } from '@/.generated/api'
import { Models } from '@/.generated/api/models'
import useUserStore from '@/store/userStore'
import ScrollableList from '@/pages/components/ScrollabletList'

const PointsDetail = () => {
    const chainId = useChainId()
    const { currentUser } = useUserStore()

    const [params] = useState({ ...new Models.ApiIntegralRecordPageGETParams(), limit: 10, page: 1, userId: currentUser.userId })

    const renderItem = (item: Models.IntegralVo) => {
        return (<><ul className='grid grid-cols-3 w-full list-none text-14'>
            <li>{item.createDate}</li>
            <li>{((item.points ?? 0) / 100).toFixed(2)}</li>
        </ul></>)
    }

    return (<div>

        <ul className='grid grid-cols-3 list-none text-14 c-#7F8FA4'>
            <li>TIME</li>
            <li>Quantity</li>
        </ul>
        <ScrollableList api={IntegralRecordService.ApiIntegralRecordPage_GET} chainId={chainId} params={params} containerId='PointsDetailScrollable' renderItem={renderItem} />
    </div>)
}

export default PointsDetail
