/* eslint-disable @typescript-eslint/indent */
import type { TooltipProps } from 'recharts'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import * as dayjs from 'dayjs'
import { useChainId } from 'wagmi'
import { PortfolioService } from '@/.generated/api'
import toCurrencyString from '@/utils/convertToCurrencyString'

interface balanceType {
    time: string
    balance: number
}

export default function BalanceChart() {
    const chainId = useChainId()
    const [balanceData, setBalanceData] = useState<balanceType[]>([])

    useEffect(() => {
        async function getData() {
            const res = await PortfolioService.ApiPortfolioUserTotalInfo_GET(chainId)
            return res
        }
        const list: balanceType[] = []
        getData().then((res) => {
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

    return <ResponsiveContainer width='100%' height='100%' >
        <AreaChart data={balanceData}>
            <defs>
                <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
                    <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
                </linearGradient>
            </defs>
            <Area
                dataKey="balance"
                stroke="#2451B7"
                fill="url(#color)"
                dot={{ strokeWidth: 0.2 }}
                strokeWidth={3}
            />
            <XAxis
                hide={true}
                dataKey="time"
                axisLine={false}
                tickLine={false}
            />

            <YAxis
                dataKey="balance"
                hide={true}
                axisLine={false}
                tickLine={false}
                tickCount={6}
                tickFormatter={number => `$${number.toFixed(2)}`}
            />
            <Tooltip content={<CustomTooltip />} />

            <CartesianGrid opacity={0.1} vertical={false} />
        </AreaChart>
    </ResponsiveContainer>
}
