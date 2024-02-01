import { Modal, type ModalProps } from 'antd'

import type { ReactNode } from 'react'
import React from 'react'

interface ISModalProps extends ModalProps {
  content: ReactNode

}

const SModal: React.FC<ISModalProps> = (props) => {
  return <Modal {...props}> {props.content}</Modal>
}

export default SModal
