import type { JsonRpcSigner } from 'ethers'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

let provider: ethers.BrowserProvider | null = null

const useEthers = () => {
  const [signer, setSigner] = useState<JsonRpcSigner>()

  function getProvide(): ethers.BrowserProvider | null {
    if (provider)
      return provider

    return provider = new ethers.BrowserProvider(window.ethereum)
  }

  useEffect(() => {
    async function getSigner() {
      try {
        const signer = await provider?.getSigner()
        setSigner(signer)
      }
      catch (error) {
        console.error('Error getting signer:', error)
      }
    }

    getSigner()
  }, [])

  return { getProvide, signer }
}

export default useEthers
