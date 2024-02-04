/* eslint-disable @typescript-eslint/indent */
import { Line, LineChart, XAxis } from 'recharts'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { PortfolioService } from '@/.generated/api'

interface balanceType {
    timestamp: number
    balance: number
}

export default function BalanceChart() {
    const [balanceData, setBalanceData] = useState<balanceType[]>([])

    useEffect(() => {
        async function getData() {
            const res = await PortfolioService.ApiPortfolioUserTotalInfo_GET()
            return res
        }
        const list: balanceType[] = []
        getData().then((res) => {
            res.records?.map((e) => {
                console.log(e)
                list.push({
                    timestamp: e.createDate,
                    balance: Number(ethers.formatUnits(e.uPrice)),
                })
                return true
            })
            console.log(111, list)
            setBalanceData(list)
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
