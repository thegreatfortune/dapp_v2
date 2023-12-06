import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import useBrowserContract from '@/hooks/useBrowserContract'

interface IProps {
  isOrderOriginator: boolean // 是否订单发起人
  tradeId: bigint | null
}

class IncomeInfo {
  extractable: string | undefined
  liquidation: string | undefined
  repayment: string | undefined
  dividend: string | undefined
}

const IncomeCalculation: React.FC<IProps> = ({ tradeId, isOrderOriginator }) => {
  const { browserContractService } = useBrowserContract()
  const [incomeInfo, setIncomeInfo] = useState(new IncomeInfo())

  useEffect(() => {
    async function fetchData() {
      if (!browserContractService || tradeId === null)
        return
      console.log('%c [ tradeId ]-24', 'font-size:13px; background:#978e00; color:#dbd244;', tradeId)

      try {
        const processCenterContract = await browserContractService?.getProcessCenterContract()

        if (isOrderOriginator) {
          const extractable = await processCenterContract?.getBorrowerToProfit(tradeId)
          setIncomeInfo(preState => ({ ...preState, extractable: String(extractable) }))
        }
        else {
          const tokenId = await browserContractService?.ERC3525_getTokenId(tradeId)

          if (!tokenId)
            throw new Error('Could not get tokenId ')

          const extractable = await processCenterContract?.getUserTotalMoney(tokenId)
          const liquidation = await processCenterContract?.getLenderToSurplusMoney(tokenId)
          const repayment = await processCenterContract?.getLenderToRepayMoney(tokenId)
          const dividend = await processCenterContract?.getShareProfit(tokenId)

          setIncomeInfo(preState => ({ ...preState, extractable: String(extractable), liquidation: String(liquidation), repayment: String(repayment), dividend: String(dividend) }))
        }
      }
      catch (error) {
        console.log('%c [ error ]-17', 'font-size:13px; background:#36b01d; color:#7af461;', error)
      }
    }

    fetchData()
  }, [tradeId, isOrderOriginator, browserContractService])

  return (<div className='flex gap-x-24'>
    {
      // TODO 取消注释
      Number(incomeInfo.extractable ?? 0) > 0
      && <div>
        <span>
          extractable({ethers.formatUnits(incomeInfo.extractable ?? 0)}U)
        </span>
        {
          !isOrderOriginator
          && <span>
            =
            <span>liquidation({ethers.formatUnits(incomeInfo.liquidation ?? 0)}U) +</span>

            <span>repayment({ethers.formatUnits(incomeInfo.repayment ?? 0)}U) +</span>

            <span>dividend({ethers.formatUnits(incomeInfo.dividend ?? 0)}U)</span>
          </span>
        }

      </div>
    }

  </div>)
}

export default IncomeCalculation
