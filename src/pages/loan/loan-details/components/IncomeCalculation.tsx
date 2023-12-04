import React, { useEffect, useState } from 'react'
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

      try {
        const tokenId = await browserContractService?.ERC3525_getTokenId(tradeId)

        if (!tokenId)
          throw new Error('Could not get tokenId ')

        const processCenterContract = await browserContractService?.getProcessCenterContract()

        if (isOrderOriginator) {
          const extractable = await processCenterContract?.getBorrowerToProfit(tradeId)
          setIncomeInfo(preState => ({ ...preState, extractable: String(extractable) }))
        }
        else {
          const extractable = await processCenterContract?.getLenderToRepayMoney(tokenId)
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
  }, [tradeId, isOrderOriginator])

  return (<div className='flex gap-x-24'>
    <span>
    extractable({incomeInfo.extractable}U)=
    </span>
    <span>liquidation({incomeInfo.liquidation})U +</span>

    <span>repayment({incomeInfo.repayment})U +</span>

    <span>dividend({incomeInfo.dividend})U</span>
  </div>)
}

export default IncomeCalculation
