import type { ModalProps } from 'antd'
import { Button, Modal } from 'antd'
import React from 'react'

interface ISModalProps extends ModalProps {

}

const SModal: React.FC<ISModalProps> = (props) => {
  return <Modal {...props}> {props.children}</Modal>
}

export default SModal
