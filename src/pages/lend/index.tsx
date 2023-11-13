import { useEffect } from 'react'
import { BrowserContractService } from '@/contract/browserContractService'

const Lend = () => {
  useEffect(() => {
    async function mounted() {
      const followFactoryContract = await BrowserContractService.getFollowFactoryContract()

      const followCapitalPoolContract = await BrowserContractService.getFollowCapitalPoolContract()

      const signer = await BrowserContractService.getSigner()

      const capitalPoolAddress = await followFactoryContract?.AddressGetCapitalPool(signer?.address ?? '')

      const followManageContract = await BrowserContractService.getFollowManageContract()

      const tId = await followManageContract.getUserAllOrdersId(signer?.address ?? '', capitalPoolAddress)
      console.log('%c [ tId ]-16', 'font-size:13px; background:#c5c6ac; color:#fffff0;', tId)

      const sss = await followCapitalPoolContract.getList(tId?.at(-1) ?? BigInt(0))
      console.log('%c [ sss ]-21', 'font-size:13px; background:#c7a852; color:#ffec96;', sss)

      //   sss.14
      //   if(sss.14 > sss.13 ) {

      //     console.log('%c [ 大了 ]-25', 'font-size:13px; background:#5a799d; color:#9ebde1;', );
      //   }

      //   const res = await followCapitalPoolContract.lend(10, tId?.at(-1) ?? BigInt(0))

      //   const result = res.wait()
      //   console.log('%c [ result ]-23', 'font-size:13px; background:#9613b5; color:#da57f9;', result)
    }

    mounted()
  }, [])

  return (<div>5455</div>)
}

export default Lend
