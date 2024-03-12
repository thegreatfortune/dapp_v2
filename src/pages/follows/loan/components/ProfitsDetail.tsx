import React, { useEffect, useState } from 'react'
import { formatUnits } from 'ethers'
import { Select } from 'antd'
import { useChainId } from 'wagmi'
import useCoreContract from '@/hooks/useCoreContract'
import { TokenEnums } from '@/enums/chain'
import { executeTask } from '@/helpers/helpers'

interface IProps {
  tradeId: bigint
  isLoanOwner: boolean
}

interface IProfits {
  withdrawable: string
  liquidate: string
  repay: string
  dividend: string
}

const ProfitsDetail: React.FC<IProps> = ({ tradeId, isLoanOwner }) => {
  const chainId = useChainId()
  const { coreContracts } = useCoreContract()
  const [profits, setProfits] = useState<IProfits>({
    withdrawable: '0',
    liquidate: '0',
    repay: '0',
    dividend: '0',
  })

  useEffect(() => {
    const task = async () => {
      if (coreContracts && isLoanOwner) {
        const profit = await coreContracts.processCenterContract.getBorrowerToProfit(tradeId)
        setProfits((prev) => {
          return { ...prev, withdrawable: formatUnits(profit, TokenEnums[chainId].USDC.decimals) }
        })
      }
    }
    executeTask(task)
    console.log(profits)
  }, [tradeId, isLoanOwner, coreContracts])

  return (<div className='mx-10'>
    <Select
      className='h-40'
      defaultValue={`Withdrawable: $${profits.withdrawable}`}
      options={[
        { label: `Withdrawable: $${profits.withdrawable}`, value: `${profits.withdrawable} U` },
        { label: `Liquidate: $${profits.liquidate}`, value: `${profits.liquidate} U` },
        { label: `Repay: $${profits.repay}`, value: `${profits.repay} U` },
        { label: `Dividend: $${profits.dividend}`, value: `${profits.dividend} U` },
      ]}
      size='middle'
    ></Select>
  </div >)
}

export default ProfitsDetail
