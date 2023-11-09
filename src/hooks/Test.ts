import { Contract, ethers } from 'ethers'
import { useEffect, useMemo } from 'react'
import followFactory_ABI from '@/abis/FollowFactory.json'
import type { FollowFactory } from '@/abis/types'

export async function TestC() {
  const provider = new ethers.BrowserProvider(window.ethereum)

  const signer = await provider.getSigner()

  const contract = new Contract(import.meta.env.VITE_FOLLOW_FACTORY_ADDRESS, followFactory_ABI, signer) as unknown as FollowFactory

  return contract
}
