import React, { useState } from 'react'
import './AddCoin.css'

interface AddCoinProps {
  address: string
}

const AddCoin: React.FC<AddCoinProps> = ({ address }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyClick = () => {
    navigator.clipboard.writeText(address)
    setIsCopied(true)

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <div className="address-container">
      <span className="address">{address}</span>
      <button onClick={handleCopyClick} className="copy-button">
        {isCopied
          ? (
          <img src="/path/to/copied-icon.svg" alt="Copied icon" />
            )
          : (
          <img src="/path/to/copy-icon.svg" alt="Copy icon" />
            )}
      </button>
    </div>
  )
}

export default AddCoin
