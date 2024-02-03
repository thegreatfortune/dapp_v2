/* eslint-disable @typescript-eslint/indent */
import { Line, LineChart, XAxis } from 'recharts'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { PortfolioService } from '@/.generated/api'

interface balanceType {
    timestamp: number
    balance: string
}

export default function BalanceChart() {
    const [balanceData, setBalanceData] = useState<balanceType[]>([])

    useEffect(() => {
        async function getData() {
            const res = await PortfolioService.ApiPortfolioUserTotalInfo_GET()
            console.log(res)
            return res
        }
        const list: balanceType[] = []
        getData().then((res) => {
            res.records?.map((e) => {
                const item = {
                    timestamp: e.createDate! * 1000,
                    balance: ethers.formatUnits(e.uPrice ?? '0'),
                }
                list.push(item)
                return true
            })
            console.log(list)
            setBalanceData(list)
            return true
        })
    }, [])

    return <LineChart width={500} height={500} data={balanceData}>
        <XAxis dataKey="Day" />
        <Line
            type="monotone"
            dataKey="balance"
            stroke="#8884d8"
            dot={{ strokeWidth: 2 }}
            strokeWidth={4} />
    </LineChart>
}
