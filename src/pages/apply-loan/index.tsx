import Select from 'antd/es/select'
import Form from 'antd/es/form'
import Dragger from 'antd/es/upload/Dragger'
import TextArea from 'antd/es/input/TextArea'
import Button from 'antd/es/button'
import Image from 'antd/es/image'
import './style.css'
import { useTranslation } from 'react-i18next'
import InputNumber from 'antd/es/input-number'
import { useEffect, useState } from 'react'
import Modal from 'antd/es/modal'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import Checkbox from 'antd/es/checkbox'
import type { JsonRpcSigner } from 'ethers'
import airplane from '@/assets/images/airplane.png'
import jmtzDown from '@/assets/images/jmtz_down.png'
import { BrowserContractService } from '@/contract/BrowserContractService'
import type { LoanRequisitionEditModel } from '@/models/LoanRequisitionEditModel'
import type { FollowFactory } from '@/abis/types'

const ApplyLoan = () => {
  const [form] = Form.useForm()
  const { t } = useTranslation()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [capitalPoolChecked, setCapitalPoolChecked] = useState(false)

  const [repaymentPoolChecked, setRepaymentPoolChecked] = useState(false)

  const [followFactoryContract, setFollowFactoryContract] = useState<FollowFactory>()

  const [signer, setSigner] = useState<JsonRpcSigner | undefined>()

  const [publishBtnLoading, setPublishBtnLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const followFactoryContract = await BrowserContractService.getFollowFactoryContract()

        const signer = await BrowserContractService.getSigner()

        setSigner(signer)

        setFollowFactoryContract(followFactoryContract)

        // const sxs = await followFactoryContract.getIfCreate('0xd6E8698Db7C223557Fd1bBF3bb4ecF2C858b3Bbf')
        // console.log('%c [ sxs ]-38', 'font-size:13px; background:#69a758; color:#adeb9c;', sxs)
      }
      catch (error) {
        console.error('Error:', error)
      }
    }

    fetchData()
  }, [])

  const onFinish = async (value: LoanRequisitionEditModel) => {
    setPublishBtnLoading(true)
    try {
      if (!capitalPoolChecked) {
        const isCreated = (await followFactoryContract?.getIfCreate(signer?.address ?? '')) === BigInt(1)

        setCapitalPoolChecked(isCreated)
      }

      if (!repaymentPoolChecked) {
        const followRefundFactoryContract = await BrowserContractService.getFollowRefundFactoryContract()

        const isCreated = (await followRefundFactoryContract.getIfCreateRefundPool(signer?.address ?? '')) === BigInt(1)

        setRepaymentPoolChecked(isCreated)
      }

      setPublishBtnLoading(false)
      setIsModalOpen(true)
    }
    catch (error) {
      console.log('%c [ error ]-61', 'font-size:13px; background:#c95614; color:#ff9a58;', error)
    }
  }

  const handleOk = async () => {
    try {
      // 检查是否创建资金池
      if (!capitalPoolChecked) {
        const isCreated = (await followFactoryContract?.getIfCreate(signer?.address ?? '')) === BigInt(1)

        if (!isCreated)
          await followFactoryContract?.magicNewCapitalPool(signer?.address ?? '')

        setCapitalPoolChecked(isCreated)
      }
    }
    catch (error) {
      console.log('%c [ error ]-63', 'font-size:13px; background:#79fddf; color:#bdffff;', error)
    }

    try {
      if (capitalPoolChecked && !repaymentPoolChecked) {
        const followRefundFactoryContract = await BrowserContractService.getFollowRefundFactoryContract()

        const isCreated = (await followRefundFactoryContract.getIfCreateRefundPool(signer?.address ?? '')) === BigInt(1)

        if (!isCreated) {
          console.log('创建还款池')

          await followRefundFactoryContract.createRefundPool()
        }

        setRepaymentPoolChecked(isCreated)
      }
    }
    catch (error) {
      console.log('%c [ error ]-77', 'font-size:13px; background:#f8d8c0; color:#ffffff;', error)
    }

    // try {

    //   // if (capitalPoolChecked && repaymentPoolChecked) {
    //   //   followFactoryContract?.createOrder()
    //   // }

    // }
    // catch (error) {
    //   console.log('%c [ error ]-99', 'font-size:13px; background:#daf6df; color:#ffffff;', error)
    // }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onChange = (e: CheckboxChangeEvent) => {
    console.log(`checked = ${e.target.checked}`)
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
      <Modal okText="Create" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>

        <Checkbox disabled checked={capitalPoolChecked} onChange={onChange}>Capital pool contract</Checkbox>
        <Checkbox disabled checked={repaymentPoolChecked} onChange={onChange}>Create a repayment pool</Checkbox>
      </Modal>
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
          // rules={[
          //   {
          //     required: true,
          //     message: 'Please upload your file!',
          //   },
          // ]}
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
              name="loanName"
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
              name="description"
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
            name="loanAmount"
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

          <Form.Item
            name='loanCycle'
            rules={[
              {
                required: true,
                message: 'Please input content!',
              },
            ]} label={<span className="text-24">{t('applyLoan.formItem.cycle.label')}</span>}>
            <Select
              popupClassName='bg-#111a2c border-2 border-#303241 border-solid px30'
              className='box-border h68 s-container text-24 !w412'
              suffixIcon={<img src={jmtzDown} alt="jmtzDown" className='px30' />}
              options={[{ value: 10, label: 10 }, { value: 20, label: 20 }, { value: 30, label: 30 }, { value: 60, label: 60 }, { value: 90, label: 90 }, { value: 180, label: 180 }]}
            />
          </Form.Item>

          <Form.Item
            name='installmentCount'
            rules={[
              {
                required: true,
                message: 'Please input content!',
              },
            ]} label={<span className="text-24">{t('applyLoan.formItem.period.label')}</span>}>
            <Select
              popupClassName='bg-#111a2c border-2 border-#303241 border-solid px30'
              className='box-border h68 s-container text-24 !w412'
              suffixIcon={<img src={jmtzDown} alt="jmtzDown" className='px30' />}
              options={[{ value: 1, label: 1 }, { value: 2, label: 2 }, { value: 5, label: 5 }, { value: 10, label: 10 }]}
            />
          </Form.Item>

          <Form.Item
            name='loanParts'
            label={<span className="text-24">{t('applyLoan.formItem.numberOfCopies.label')}</span>} >
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

          <Form.Item
            name='minCompletionParts'
            label={<span className="text-24">{t('applyLoan.formItem.minimumRequiredCopies.label')}</span>} >
            <InputNumber
              min={2}
              max={10000}
              className='box-border h68 w412 items-center s-container px-30 pr-106 text-24'
              suffix={
                <div className='px-20 text-24'>share</div>
              }
            />
          </Form.Item>

          <Form.Item
            name='interestRate'
            rules={[
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

          <Form.Item
            name='dividendPercentage'
            label={<span className="text-24">{t('applyLoan.formItem.dividend.label')}</span>} >
            <InputNumber
              min={0}
              max={100}
              className='box-border h68 w412 items-center s-container px-30 pr-106 text-24'
              suffix={
                <div className='px-20 text-24'>%</div>
              }
            />
          </Form.Item>

          <Form.Item
            name='fundraisingTime'
            rules={[
              {
                required: true,
                message: 'Please input content!',
              },
            ]} label={<span className="text-24">{t('applyLoan.formItem.raisingTime.label')}</span>}>
            <Select
              popupClassName='bg-#111a2c border-2 border-#303241 border-solid px30'
              className='box-border h68 s-container text-24 !w412'
              suffixIcon={<img src={jmtzDown} alt="jmtzDown" className='px30' />}
              options={[{ value: 1, label: 1 }, { value: 3, label: 3 }, { value: 7, label: 7 }, { value: 14, label: 14 }, { value: 20, label: 20 }]}
            />
          </Form.Item>
        </div>

        <div className='h50' />

        <div className='flex items-end gap-x-59'>
          <Form.Item
            initialValue='YES'
            rules={[
              {
                required: true,
                message: 'Please input content!',
              },
            ]} className='m0' label={<span className="text-24">{t('applyLoan.formItem.designatedTransaction.label')}</span>}>
            <Select
              popupClassName='bg-#111a2c border-2 border-#303241 border-solid px30'
              className='box-border h68 s-container text-24 !w306'
              suffixIcon={<img src={jmtzDown} alt="jmtzDown" className='px30' />}
              defaultValue="YES"
              options={[{ value: 'YES', label: 'NO' }]}
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
          <Button type="primary" htmlType="submit" loading={publishBtnLoading} className='h78 w300 text-24 primary-btn'>
            {t('applyLoan.btn.submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ApplyLoan
