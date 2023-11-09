import { useMemo } from 'react'
import { Contract, JsonRpcProvider } from 'ethers'

export const useBrowserContract = <T>(
  contractAddress: string,
  abi: any,
) => {
  return useMemo(() => {
    const provider = new JsonRpcProvider(import.meta.env.VITE_RPC)

    if (!contractAddress || !abi)
      return null

    try {
      const contract = new Contract(contractAddress, abi, provider) as T

      return contract
    }
    catch (error) {
      console.error('Error connecting to contract:', error)
      return null
    }
  }, [contractAddress, abi])
}
