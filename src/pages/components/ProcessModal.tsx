import React, { useEffect, useState } from 'react'
import type { ModalProps } from 'antd'
import { Button, Input, Modal } from 'antd'

interface IProps extends ModalProps {
  onConfirmAPI: () => Promise<void> // Function to handle confirm action
  getMaxValueAPI: () => Promise<number> // Function to fetch MAX value
}

enum LoadingState {
  Initial,
  Processing,
  Succeeded,
}

const ProcessModal: React.FC<IProps> = ({ onConfirmAPI: onConfirm, getMaxValueAPI: getMaxValue, ...props }) => {
  const [inputValue, setInputValue] = useState<string | undefined>()
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Initial)
  const [maxValue, setMaxValue] = useState<number | undefined>()

  useEffect(() => {
    // Fetch MAX value when the component mounts
    const fetchMaxValue = async () => {
      try {
        const max = await getMaxValue()
        setMaxValue(max)
      }
      catch (error) {
        console.error('Error fetching MAX value:', error)
      }
    }

    fetchMaxValue()
  }, [getMaxValue])

  const handleConfirm = async () => {
    try {
      setLoadingState(LoadingState.Processing)

      // Call the onConfirm function provided by the parent
      await onConfirm()

      setLoadingState(LoadingState.Succeeded)
    }
    catch (error) {
      setLoadingState(LoadingState.Initial)
      console.error('Error during confirm:', error)
      // Handle error if needed
    }
  }

  const renderContent = () => {
    switch (loadingState) {
      case LoadingState.Initial:
        return (
          <div className='flex'>
            <Input
              placeholder="Enter value"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
            />
            <Button type="primary" onClick={() => setInputValue(maxValue?.toString() || '')}>MAX</Button>
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

        <div className='h30'/>

        <div className='flex'>
          <Button key="cancel" onClick={props.onCancel}>
            Cancel
          </Button>
          {loadingState === LoadingState.Initial && (
            <Button key="confirm" type="primary" onClick={handleConfirm}>
              Confirm
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default ProcessModal
