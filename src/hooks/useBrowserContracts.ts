import { Contract, type ethers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { BrowserContractService } from '../contract/browserContractService'
import useBrowserContract from './useBrowserContract'
import type { FollowCapitalPool, FollowFactory, FollowManage, FollowRefundFactory, FollowRefundPool, ProcessCenter } from '@/abis/types'
import followFactory_ABI from '@/abis/FollowFactory.json'
import followCapitalPool_ABI from '@/abis/FollowCapitalPool.json'
import followRefundFactory_ABI from '@/abis/FollowRefundFactory.json'
import followRefundPool_ABI from '@/abis/FollowRefundPool.json'
import processCenter_ABI from '@/abis/ProcessCenter.json'
import followManage_ABI from '@/abis/FollowManage.json'

function createContract<T>(
  address: string,
  abi: any,
  signer: ethers.Signer,
): T {
  return new Contract(address, abi, signer) as T
}

const useBrowserContracts = () => {
  const { signer } = useBrowserContract()

  // const [followFactoryContract, setFollowFactoryContract] = useState()

  return useMemo(() => {
    if (!signer)
      return

    return {
      followFactoryContract: createContract<FollowFactory>(
        import.meta.env.VITE_FOLLOW_FACTORY_ADDRESS,
        followFactory_ABI,
        signer,
      ),
    }
  }, [signer])

  // const [provider, setProvider] = useState<ethers.BrowserProvider>()
  // const [signer, setSigner] = useState<ethers.JsonRpcSigner>()
  // const [browserContractService, setBrowserContractService] = useState<BrowserContractService>()

  // useEffect(() => {
  //   const initializeProvider = async () => {
  //     if (!provider) {
  //       const newProvider = new ethers.BrowserProvider(window.ethereum)
  //       setProvider(newProvider)
  //     }
  //   }

  //   const initializeSigner = async () => {
  //     if (!signer && provider) {
  //       const newSigner = await provider.getSigner()
  //       const newBrowserContractService = new BrowserContractService(newSigner)
  //       setBrowserContractService(() => newBrowserContractService)
  //       setSigner(newSigner)
  //     }
  //   }

  //   initializeProvider()
  //   initializeSigner()
  // }, [provider, signer])

  // return {
  //   provider,
  //   signer,
  //   browserContractService,
  // }
}

export default useBrowserContracts
