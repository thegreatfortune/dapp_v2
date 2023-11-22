import { InputNumber, Modal, type ModalProps } from 'antd'

interface IProps extends ModalProps {

}

const SwapModal: React.FC<IProps> = (props) => {
  return (
        <Modal {...props}>
            <div>
                <h2>swap</h2>
                <div>
                    you pay
                    <InputNumber className='w-full' />
                </div>
                <div>
                    you receiver
                    <InputNumber className='w-full' />
                </div>
            </div>

        </Modal>
  )
}

export default SwapModal
