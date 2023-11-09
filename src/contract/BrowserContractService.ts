import { Contract, ethers } from 'ethers'
import type { FollowFactory } from '@/abis/types'
import followFactory_ABI from '@/abis/FollowFactory.json'

function createContract<T>(
  address: string,
  abi: any,
  signer: ethers.Signer,
): T {
  return new Contract(address, abi, signer) as T
}

export class BrowserContractService {
  static provider: ethers.BrowserProvider | undefined

  static signer: ethers.JsonRpcSigner | undefined

  static get getterProvider(): ethers.BrowserProvider | undefined {
    if (this.provider)
      return this.provider

    return this.provider = new ethers.BrowserProvider(window.ethereum)
  }

  static async getSigner(): Promise<ethers.JsonRpcSigner | undefined> {
    if (this.signer)
      return this.signer

    return this.signer = await this.getterProvider?.getSigner()
  }

  static async broFollowFactoryContract(): Promise<FollowFactory> {
    return createContract<FollowFactory>(
      import.meta.env.VITE_FOLLOW_FACTORY_ADDRESS as string,
      followFactory_ABI,
      (await this.getSigner())!,
    )
  }
}
