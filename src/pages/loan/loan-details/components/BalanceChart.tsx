/* eslint-disable @typescript-eslint/indent */
import type { TooltipProps } from 'recharts'
import { Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import * as dayjs from 'dayjs'
import { PortfolioService } from '@/.generated/api'
import toCurrencyString from '@/utils/convertToCurrencyString'

interface balanceType {
    time: string
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
            console.log('0000', res.records)
            if (res.records) {
                res.records.sort((a, b) => {
                    if (a.createDate > b.createDate)
                        return 1
                    else
                        return -1
                })
                for (let i = 0; i < res.records.length; i++) {
                    const e = res.records[i]
                    list.push({
                        time: dayjs.unix(e.createDate).format('YYYY/MM/DD HH:mm:ss'),
                        balance: Number(ethers.formatUnits(e.uPrice)),
                    })
                }
                setBalanceData(list)
            }
        })
    }, [])

    const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip h-100 items-center rounded-6 bg-white p-2 text-18 font-bold text-black">
                    <div className='mt-8 flex items-center justify-between'>
                        <div className='mx-12 my-6 w-80'>Date:</div>
                        <div className="label mx-12">{label}</div>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className='mx-12 my-6 w-80'>Balance:</div>
                        <div className="label mx-12">$ {toCurrencyString(payload[0].value ?? 0)}</div>
                    </div>
                </div>
            )
        }
        return null
    }

    return <LineChart width={500} height={500} data={balanceData}>
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Line
            type="monotone"
            dataKey="balance"
            stroke="#8884d8"
            dot={{ strokeWidth: 2 }}
            strokeWidth={4} />
    </LineChart>
}
