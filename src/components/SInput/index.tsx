import type { TextAreaProps } from 'antd/es/input/TextArea'
import TextArea from 'antd/es/input/TextArea'

interface IProps extends TextAreaProps {
  inputclassname?: string // 使用小写
}

const SInput: React.FC<IProps> = (props) => {
  return (
    <div className={props.className}>
      <span className='text-24 font-400 c-#FFFFFF'>Title</span>
      <TextArea
        style={{ height: 102, resize: 'none' }}
        {...props}
        className={props.inputclassname} // 使用小写
      />
    </div>
  )
}

export default SInput
