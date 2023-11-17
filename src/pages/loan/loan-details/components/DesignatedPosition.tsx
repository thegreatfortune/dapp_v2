import { useEffect } from 'react'
import useBrowserContract from '@/hooks/useBrowserContract'

const DesignatedPosition = () => {
  const { browserContractService } = useBrowserContract()

  useEffect(() => {
    async function fetchFeeData() {
      const ERC20Contract = await browserContractService?.getERC20Contract()
      console.log('%c [ import.meta.env.VITE_USDC_ADDRESS ]-11', 'font-size:13px; background:#97eb99; color:#dbffdd;', import.meta.env.VITE_USDC_ADDRESS)
      const balance = await ERC20Contract?.balanceOf(browserContractService?.getSigner.address ?? '')
      console.log('%c [ balance ]-11', 'font-size:13px; background:#d6301a; color:#ff745e;', balance)

      // 查询代币的符号和小数位数
      const symbol = await ERC20Contract?.symbol()
      const decimals = await ERC20Contract?.decimals()

      console.log(`Symbol: ${symbol}`)
      console.log(`Decimals: ${decimals}`)
    }

    fetchFeeData()
  }, [browserContractService])

  return (<div className="flex justify-between">
        <div className="h560 w634"></div>
        <div>
            <ul className="m0 flex flex-wrap list-none p0">
                <li className="block h160 w321 p0">46546</li>
            </ul>
        </div>
    </div>)
}

export default DesignatedPosition
