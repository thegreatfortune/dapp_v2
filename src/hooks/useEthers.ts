import { ethers } from 'ethers'

let provider: ethers.BrowserProvider | undefined

let signer: ethers.JsonRpcSigner | undefined

export async function useEthers() {
  function getProvide(): ethers.BrowserProvider | null {
    if (provider)
      return provider

    return provider = new ethers.BrowserProvider(window.ethereum)
  }

  async function getSigner(): Promise<ethers.JsonRpcSigner | undefined> {
    try {
      if (signer)
        return signer

      return signer = await provider?.getSigner()
    }
    catch (error) {
      console.error('Error getting signer:', error)
    }
  }

  return { getProvide, getSigner }
}
