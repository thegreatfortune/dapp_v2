import Select from 'antd/es/select'
import Form from 'antd/es/form'
import Dragger from 'antd/es/upload/Dragger'
import TextArea from 'antd/es/input/TextArea'
import Button from 'antd/es/button'
import Image from 'antd/es/image'
import './style.css'
import { useTranslation } from 'react-i18next'
import InputNumber from 'antd/es/input-number'
import { useEffect } from 'react'
import airplane from '@/assets/images/airplane.png'
import jmtzDown from '@/assets/images/jmtz_down.png'
import { BrowserContractService } from '@/contract/BrowserContractService'

const ApplyLoan = () => {
  const [form] = Form.useForm()
  const { t } = useTranslation()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const aa = await BrowserContractService.broFollowFactoryContract()

        const cd = await aa.getIfCreate('0xCfA09f923d29E41C4dCcb817A06D0BC3D73F6e1B')
        console.log('%c [ cd ]-34', 'font-size:13px; background:#824ac5; color:#c68eff;', cd)
      }
      catch (error) {
        console.error('Error:', error)
      }
    }

    fetchData()
  }, [])
  const onFinish = () => {
    console.log('Received values:')
  }

  const beforeUpload = () => {
    // if (file.size / 1024 / 1024 > 2) {
    //   message.error('File must be smaller than 2MB!')
    //   return false
    // }
    return true
  }

  return (
    <div>
      <div className="h112"></div>
      <Form
        form={form}
        layout='vertical'
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        name="apply-loan-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <div className="w-full flex justify-between">

          <Form.Item
            name="file"
            className="m0 box-border h561 w-639 border-1 border-#303241 rounded-20 border-solid bg-#171822"
            valuePropName="fileList"
            getValueFromEvent={e => e.fileList}
            rules={[
              {
                required: true,
                message: 'Please upload your file!',
              },
            ]}
          >
            <div
              className="m0 box-border h561 w-639 border-1 border-#303241 rounded-20 border-solid bg-#171822"
            >
              <Dragger
                name="file"
                multiple={true}
                action="/upload.do"
                style={{ height: 561 }}
                beforeUpload={beforeUpload}
              >
                <Image src={airplane} preview={false} />

                <p className="ant-upload-drag-icon"></p>
                <p className="ant-upload-text !text-36 !font-bold">{t('applyLoan.formItem.upload.title')}</p>
                <p className="ant-upload-hint !text-24">
                  800 x 800px {t('applyLoan.formItem.upload.description')}
                </p>
              </Dragger>
            </div>
          </Form.Item>

          <div className="w-735">
            <Form.Item
              name="title1"
              className='w-full'
              label={<span className="text-24">{t('applyLoan.formItem.item.label')}</span>}
              rules={[
                {
                  required: true,
                  message: 'Please input your title!',
                },
                {
                  max: 10,
                  message: 'Title must be at most 10 characters.',
                },
              ]}
            >
              <TextArea className='s-container text-16' placeholder={t('applyLoan.formItem.item.placeholder')} style={{ height: 102, resize: 'none' }} />
            </Form.Item>

            <Form.Item
              name="title2"
              className='m0 w-full'
              label={<span className="text-24">{t('applyLoan.formItem.item.description.label')}</span>}
              rules={[
                {
                  required: true,
                  message: 'Please input your description!',
                },
                {
                  max: 100,
                  message: 'Title must be at most 10 characters.',
                },
              ]}
            >
              <TextArea className='s-container text-16' placeholder={t('applyLoan.formItem.item.description.placeholder')} style={{ height: 343, resize: 'none' }} />
            </Form.Item>
          </div>
        </div>

        <div className='h-51' />

        <div className='box-border h-502 w-full flex flex-wrap gap-x-52 from-#0E0F14 to-#16273B bg-gradient-to-br px30 py-44 text-24'>
          <Form.Item
            name="1523"
            rules={[
              {
                required: true,
                message: 'Please input content!',
              },
            ]}
            label={<span className="w-full text-24">{t('applyLoan.formItem.applyForLoan.label')}</span>} >
            <InputNumber
              min={100}
              max={1000000}
              className='box-border h68 w412 items-center s-container px-30 pr-106 text-24'
              suffix={
                <div className='px-20 text-24'>USDC</div>
              }
            />
          </Form.Item>

          <Form.Item rules={[
            {
              required: true,
              message: 'Please input content!',
            },
          ]} label={<span className="text-24">{t('applyLoan.formItem.cycle.label')}</span>}>
            <Select
              popupClassName='bg-#111a2c border-2 border-#303241 border-solid px30'
              className='box-border h68 s-container text-24 !w412'
              defaultValue="lucy"
              suffixIcon={<img src={jmtzDown} alt="jmtzDown" className='px30' />}
              options={[{ value: 'lucy', label: 'Lucy' }, { value: 'lucya', label: 'Lucy' }, { value: 'luacy', label: 'Lucy' }]}
            />
          </Form.Item>

          <Form.Item rules={[
            {
              required: true,
              message: 'Please input content!',
            },
          ]} label={<span className="text-24">{t('applyLoan.formItem.period.label')}</span>}>
            <Select
              popupClassName='bg-#111a2c border-2 border-#303241 border-solid px30'
              className='box-border h68 s-container text-24 !w412'
              defaultValue="lucy"
              suffixIcon={<img src={jmtzDown} alt="jmtzDown" className='px30' />}
              options={[{ value: 'lucy', label: 'Lucy' }]}
            />
          </Form.Item>

          <Form.Item label={<span className="text-24">{t('applyLoan.formItem.numberOfCopies.label')}</span>} >
            <InputNumber
              defaultValue={1}
              min={1}
              max={10000}
              className='box-border h68 w412 items-center s-container px-30 pr-106 text-24'
              suffix={
                <div className='px-20 text-24'>share</div>
              }
            />
          </Form.Item>

          <Form.Item label={<span className="text-24">{t('applyLoan.formItem.minimumRequiredCopies.label')}</span>} >
            <InputNumber
              min={2}
              max={10000}
              className='box-border h68 w412 items-center s-container px-30 pr-106 text-24'
              suffix={
                <div className='px-20 text-24'>share</div>
              }
            />
          </Form.Item>

          <Form.Item rules={[
            {
              required: true,
              message: 'Please input content!',
            },
          ]} label={<span className="text-24">{t('applyLoan.formItem.interest.label')}</span>} >
            <InputNumber
              min={5}
              max={80}
              precision={2}
              className='box-border h68 w412 items-center s-container px-30 pr-106 text-24'
              suffix={
                <div className='px-20 text-24'>%</div>
              }
            />
          </Form.Item>

          <Form.Item label={<span className="text-24">{t('applyLoan.formItem.dividend.label')}</span>} >
            <InputNumber
              min={0}
              max={100}
              className='box-border h68 w412 items-center s-container px-30 pr-106 text-24'
              suffix={
                <div className='px-20 text-24'>%</div>
              }
            />
          </Form.Item>

          <Form.Item rules={[
            {
              required: true,
              message: 'Please input content!',
            },
          ]} label={<span className="text-24">{t('applyLoan.formItem.raisingTime.label')}</span>}>
            <Select
              popupClassName='bg-#111a2c border-2 border-#303241 border-solid px30'
              className='box-border h68 s-container text-24 !w412'
              defaultValue="lucy"
              suffixIcon={<img src={jmtzDown} alt="jmtzDown" className='px30' />}
              options={[{ value: 'lucy', label: 'Lucy' }]}
            />
          </Form.Item>
        </div>

        <div className='h50' />

        <div className='flex items-end gap-x-59'>
          <Form.Item rules={[
            {
              required: true,
              message: 'Please input content!',
            },
          ]} className='m0' label={<span className="text-24">{t('applyLoan.formItem.designatedTransaction.label')}</span>}>
            <Select
              popupClassName='bg-#111a2c border-2 border-#303241 border-solid px30'
              className='box-border h68 s-container text-24 !w306'
              suffixIcon={<img src={jmtzDown} alt="jmtzDown" className='px30' />}
              defaultValue="lucy"
              options={[{ value: 'lucy', label: 'Lucy' }]}
            />
          </Form.Item>

          <Form.Item rules={[
            {
              required: true,
              message: 'Please input content!',
            },
          ]} className='m0'>
            <Select
              popupClassName='bg-#111a2c border-2 border-#303241 border-solid px30'
              className='box-border h68 s-container text-24 !w306'
              suffixIcon={<img src={jmtzDown} alt="jmtzDown" className='px30' />}
              defaultValue="lucy"
              options={[{ value: 'lucy', label: 'Lucy' }]}
            />
          </Form.Item>

          <Form.Item rules={[
            {
              required: true,
              message: 'Please input content!',
            },
          ]} className='m0' >
            <Select
              popupClassName='bg-#111a2c border-2 border-#303241 border-solid px30'
              className='box-border h68 s-container text-24 !w306'
              suffixIcon={<img src={jmtzDown} alt="jmtzDown" className='px30' />}
              defaultValue="lucy"
              options={[{ value: 'lucy', label: 'Lucy' }]}
            />
          </Form.Item>

          <Form.Item rules={[
            {
              required: true,
              message: 'Please input content!',
            },
          ]} className='m0' >
            <Select
              popupClassName='bg-#111a2c border-2 border-#303241 border-solid px30'
              className='box-border h68 s-container text-24 !w306'
              suffixIcon={<img src={jmtzDown} alt="jmtzDown" className='px30' />}
              defaultValue="lucy"
              options={[{ value: 'lucy', label: 'Lucy' }]}
            />
          </Form.Item>
        </div>

        <div className='h50' />

        <div className='flex gap-x-64'>
          {Array.from({ length: 6 }).fill(Symbol('555')).map((e, i) => <div key={i} className='h68 w180 s-container'></div>)}
        </div>

        <div className='h156' />

        <Form.Item className='text-center'>
          <Button type="primary" htmlType="submit" className='h78 w300 text-24 primary-btn'>
            {t('applyLoan.btn.submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ApplyLoan
