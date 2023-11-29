import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { BrowserContractService } from '../contract/browserContractService'

const useBrowserContract = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider>()
  const [signer, setSigner] = useState<ethers.JsonRpcSigner>()
  const [browserContractService, setBrowserContractService] = useState<BrowserContractService>()
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false)

  const checkWalletConnection = async (currentSigner: ethers.JsonRpcSigner): Promise<boolean> => {
    try {
      const network = await currentSigner.provider.getNetwork()

      const connected = network && network.chainId !== null
      setIsWalletConnected(connected)

      return connected
    }
    catch (error) {
      console.error('检查钱包连接时出错:', error)
      return false
    }
  }

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

        // Check if wallet is connected
        const connected = await checkWalletConnection(newSigner)
        setIsWalletConnected(connected)
      }
    }

    initializeProvider()
    initializeSigner()
  }, [provider, signer])

  const resetProvider = () => {
    setProvider(undefined)
    setSigner(undefined)
    setBrowserContractService(undefined)
    setIsWalletConnected(false)
  }

  return {
    provider,
    signer,
    browserContractService,
    isWalletConnected,
    resetProvider,
  }
}

export default useBrowserContract
