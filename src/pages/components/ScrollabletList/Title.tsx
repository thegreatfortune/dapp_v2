import React, { useState } from 'react'
import { Image } from 'antd'
import nativeImage from './images/native.png'
import upImage from './images/up.png'
import downImage from './images/down.png'

interface IProps {
  title: string
  className?: string
  onSorter: (imageIndex: number) => void
}

const Title: React.FC<IProps> = ({ title, className, onSorter }) => {
  const imageOrder = [nativeImage, upImage, downImage]
  const [imageIndex, setImageIndex] = useState(0)

  function onClick() {
    setImageIndex(prevIndex => (prevIndex + 1) % imageOrder.length)
    onSorter(imageIndex)
  }

  return (
    <span className={`${className} cursor-pointer hover:text-purple`} onClick={onClick}>
      {title} <Image preview={false} src={imageOrder[imageIndex]} />
    </span>
  )
}

export default Title
