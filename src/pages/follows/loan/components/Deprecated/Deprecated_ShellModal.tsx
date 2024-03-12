import React, { useEffect, useState } from 'react'
import type { ModalProps } from 'antd'
import { Button, Input, Modal, message } from 'antd'
import useBrowserContract from '@/hooks/useBrowserContract'

interface IProps extends ModalProps {
  tradeId: bigint | undefined
}

enum LoadingState {
  Initial,
  Processing,
  Succeeded,
}

const ShellModal: React.FC<IProps> = (props) => {
  const { browserContractService } = useBrowserContract()

  const [price, setPrice] = useState<string | undefined>()
  const [amount, setAmount] = useState<string | undefined>()
  const [total, setTotal] = useState<bigint | undefined>()
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Initial)

  /**
   * reset
   *
   * @param {*} props
   * @return {*}
   */
  useEffect(() => {
    if (props.open === false) {
      setPrice(undefined)
      setAmount(undefined)
      setTotal(BigInt(0))
      setLoadingState(LoadingState.Initial)
    }
  }, [props.open])

  const handleNumericInputChange = (value: string | undefined, setter: React.Dispatch<React.SetStateAction<string | undefined>>) => {
    const numericValue = value?.replace(/[^0-9]/g, '')
    setter(numericValue)
  }

  const handleConfirm = async () => {
    if (!props.tradeId || amount === undefined || price === undefined)
      throw new Error('tradeId is undefined')

    try {
      setLoadingState(LoadingState.Processing)

      const res = await browserContractService?.followMarketContract_saleERC3525(props.tradeId, BigInt(price), BigInt(amount))
      console.log('%c [ sale ]-52', 'font-size:13px; background:#8ce238; color:#d0ff7c;', res)
      if (res?.status !== 1) {
        message.error('Error during confirm')
        throw new Error('Error during confirm')
      }

      setLoadingState(LoadingState.Succeeded)
    }
    catch (error) {
      setLoadingState(LoadingState.Initial)

      message.error('Error during confirm')
      console.log('%c [ error ]-47', 'font-size:13px; background:#8354d6; color:#c798ff;', error)
    }
  }

  useEffect(() => {
    if (amount !== undefined && price !== undefined)
      setTotal(BigInt(amount ?? 0) * BigInt(price ?? 0))
  }, [amount, price])

  const renderContent = () => {
    switch (loadingState) {
      case LoadingState.Initial:
        return (
          <div>
            loadingState:  {loadingState}
            <div>
              Sell Quantity
              <Input
                placeholder="Enter value"
                value={amount}
                onChange={e => handleNumericInputChange(e.target.value, setAmount)}
              /> Share
            </div>

            <div className='h50' />

            <div className='flex'>
              Unit Price
              <Input
                placeholder="Enter value"
                value={price}
                onChange={e => handleNumericInputChange(e.target.value, setPrice)}
              />
            </div>

            <div className='h30' />

            <div>
              Total Price: {String(total)}
            </div>
          </div>
        )
      case LoadingState.Processing:
        return <div>Processing...</div>
      case LoadingState.Succeeded:
        return <div>Success!</div>
      default:
        return null
    }
  }

  return (
    <Modal
      {...props}
      footer={null}
    >
      <div className='flex flex-col items-center justify-center'>
        {renderContent()}

        <div className='h30' />

        <div className='flex'>
          {loadingState === LoadingState.Initial && (
            <Button key="confirm" type="primary" onClick={handleConfirm}>
              Confirm
            </Button>
          )}

          <Button key="cancel" onClick={props.onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ShellModal
