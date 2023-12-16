import { Contract, type ethers } from 'ethers'
import { useMemo } from 'react'
import useBrowserContract from './useBrowserContract'
import type { FollowFactory } from '@/abis/types'
import followFactory_ABI from '@/abis/FollowFactory.json'

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
