import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { BrowserContractService } from '../contract/browserContractService'
import useUserStore from '@/store/userStore'

const useBrowserContract = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider>()
  const [signer, setSigner] = useState<ethers.JsonRpcSigner>()
  const [browserContractService, setBrowserContractService] = useState<BrowserContractService>()
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false)

  const { currentUser } = useUserStore()

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

  const initializeSigner = async () => {
    if (!signer && provider) {
      const newSigner = await provider.getSigner()
      const newBrowserContractService = new BrowserContractService(newSigner)
      setBrowserContractService(() => newBrowserContractService)
      setSigner(newSigner)

      const connected = await checkWalletConnection(newSigner)
      setIsWalletConnected(connected)
    }
  }

  const initializeProvider = async () => {
    if (!provider) {
      const newProvider = new ethers.BrowserProvider(window.ethereum)
      setProvider(newProvider)
      // const newSigner = await newProvider.getSigner()

      // initializeSigner(newSigner)
    }
  }

  const setNewSigner = async (newSigner: ethers.JsonRpcSigner) => {
    setSigner(newSigner)
    const newBrowserContractService = new BrowserContractService(newSigner)
    setBrowserContractService(() => newBrowserContractService)

    const connected = await checkWalletConnection(newSigner)
    setIsWalletConnected(connected)
  }

  const setNewProvider = async (newProvider: ethers.BrowserProvider) => {
    setProvider(newProvider)
    const newSigner = await newProvider.getSigner()

    //  new NonceManager(newSigner)

    setNewSigner(newSigner)
  }

  useEffect(() => {
    if (!currentUser.accessToken)
      return
    initializeProvider()
    initializeSigner()
  }, [provider, signer, currentUser])

  const resetProvider = () => {
    setProvider(undefined)
    setSigner(undefined)
    setBrowserContractService(undefined)

    setIsWalletConnected(false)

    initializeProvider()
    initializeSigner()
  }

  return {
    provider,
    signer,
    browserContractService,
    isWalletConnected,
    resetProvider,
    initializeProvider,
    setNewProvider,
    setNewSigner,
  }
}

export default useBrowserContract
