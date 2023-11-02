import type { JsonRpcSigner } from 'ethers'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

const provider = new ethers.BrowserProvider(window.ethereum)

const useEthers = () => {
  const [signer, setSigner] = useState<JsonRpcSigner>()

  useEffect(() => {
    async function getSigner() {
      try {
        const signer = await provider.getSigner()
        setSigner(signer)
      }
      catch (error) {
        console.error('Error getting signer:', error)
      }
    }

    getSigner()
  }, [])

  return { provider, signer }
}

export default useEthers
