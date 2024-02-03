/* eslint-disable @typescript-eslint/indent */
import { Line, LineChart, XAxis } from 'recharts'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { PortfolioService } from '@/.generated/api'

interface balanceType {
    timestamp: number
    balance: number
}

interface tokenData {
    createDate: number
    uPrice: string
}

export default function BalanceChart() {
    const [balanceData, setBalanceData] = useState<balanceType[]>([])

    useEffect(() => {
        async function getData() {
            const res = await PortfolioService.ApiPortfolioLoanPortfolio_GET()
            return res
        }
        getData().then((res) => {
            const list: balanceType[] = []
            Object.values(res).map((value) => {
                value.forEach((e: tokenData, i: number) => {
                    if (list.length > i) {
                        list[i].timestamp = e.createDate > list[i].timestamp ? e.createDate : list[i].timestamp
                        list[i].balance += Number(ethers.formatUnits(value[0].uPrice ?? '0'))
                    }
                    else {
                        list.push({
                            timestamp: e.createDate,
                            balance: Number(ethers.formatUnits(value[0].uPrice ?? '0')),
                        })
                    }
                })
                return true
            })
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
