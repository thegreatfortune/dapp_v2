import { useEffect, useState } from 'react'
import useBrowserContract from '@/hooks/useBrowserContract'

interface IProps {
  tradeId: bigint | null
}

class CoinInfo {
  name: string | undefined
  USDC: number = 0
}

const DesignatedPosition: React.FC<IProps> = (props) => {
  const { browserContractService } = useBrowserContract()

  const [coinInfos, setCoinInfos] = useState<CoinInfo[]>([])

  useEffect(() => {
    async function fetchData() {
      if (!props?.tradeId)
        return
      const list: CoinInfo[] = []
      const ERC20Contract = await browserContractService?.getERC20Contract('0xCfA09f923d29E41C4dCcb817A06D0BC3D73F6e1B')

      const cp = await browserContractService?.getCapitalPoolAddress(props.tradeId)

      if (!cp)
        return

      const balance = await ERC20Contract?.balanceOf(cp)
      console.log('%c [ balance ]-11', 'font-size:13px; background:#d6301a; color:#ff745e;', balance)

      // 查询代币的符号和小数位数
      const symbol = await ERC20Contract?.symbol()
      const decimals = await ERC20Contract?.decimals()

      if (decimals) {
        list.push({
          name: symbol,
          USDC: Number(balance ?? BigInt(0) / BigInt(10 ** Number(decimals)) ?? 1),
        })
      }

      console.log(`Symbol: ${symbol}`)
      console.log(`Decimals: ${decimals}`)
      console.log('%c [ list ]-17', 'font-size:13px; background:#f3e558; color:#ffff9c;', list)
    }

    fetchData()
  }, [browserContractService])

  // function

  return (<div className="flex justify-between">
        <div className="h560 w634"></div>
        <div>
            <ul className="m0 flex flex-wrap list-none s-container p0">
                <li className="block h160 w321 p0">46546</li>
            </ul>
        </div>
    </div>)
}

export default DesignatedPosition
