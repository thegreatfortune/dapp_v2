// import { ethers } from 'ethers'
// import { useEffect, useState } from 'react'

// let provider: ethers.JsonRpcProvider | null = null
// let signer: ethers.Signer | null = null

// export const useEthereumProvider = (): ethers.JsonRpcProvider | null => {
//   const [ethProvider, setEthProvider] = useState<ethers.JsonRpcProvider | null>(provider)

//   useEffect(() => {
//     if (!provider) {
//       provider = new ethers.JsonRpcProvider(import.meta.env.VITE_RPC)
//       setEthProvider(provider)
//     }
//   }, [])

//   return ethProvider
// }

// export const useEthereumSigner = (): ethers.Signer | null => {
//   const [ethSigner, setEthSigner] = useState<ethers.Signer | null>(signer)

//   useEffect(() => {
//     if (!signer) {
//       (async () => {
//         try {
//           const ethProvider = useEthereumProvider()
//           const s = await ethProvider?.getSigner()
//           signer = s!
//           setEthSigner(signer)
//         }
//         catch (error) {
//           console.error('Error getting signer:', error)
//         }
//       })()
//     }
//   }, [])

//   return ethSigner
// }
