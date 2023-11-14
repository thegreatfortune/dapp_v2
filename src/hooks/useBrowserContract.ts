import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { BrowserContractService } from '../contract/browserContractService'

const useBrowserContract = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider>()
  const [signer, setSigner] = useState<ethers.JsonRpcSigner>()
  const [browserContractService, setBrowserContractService] = useState<BrowserContractService>()

  useEffect(() => {
    const initializeProvider = async () => {
      if (!provider) {
        const newProvider = new ethers.BrowserProvider(window.ethereum)
        setProvider(newProvider)
      }
    }

    const initializeSigner = async () => {
      if (!signer && provider) {
        const newSigner = await provider.getSigner()
        const newBrowserContractService = new BrowserContractService(newSigner)
        setBrowserContractService(() => newBrowserContractService)
        setSigner(newSigner)
      }
    }

    initializeProvider()
    initializeSigner()
  }, [provider, signer])

  return {
    provider,
    signer,
    browserContractService,
  }
}

export default useBrowserContract
