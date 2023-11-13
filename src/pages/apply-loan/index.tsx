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
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import airplane from '@/assets/images/airplane.png'
import jmtzDown from '@/assets/images/jmtz_down.png'
import { BrowserContractService } from '@/contract/BrowserContractService'
import { LoanRequisitionEditModel } from '@/models/LoanRequisitionEditModel'
import type { FollowCapitalPool, FollowFactory } from '@/abis/types'

const ApplyLoan = () => {
  const [form] = Form.useForm()
  const { t } = useTranslation()

  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [capitalPoolChecked, setCapitalPoolChecked] = useState(false)

  const [repaymentPoolChecked, setRepaymentPoolChecked] = useState(false)

  const [followFactoryContract, setFollowFactoryContract] = useState<FollowFactory>()

  const [followCapitalPoolContract, setFollowCapitalPoolContract] = useState<FollowCapitalPool>()

  const [signer, setSigner] = useState<JsonRpcSigner | undefined>()

  const [publishBtnLoading, setPublishBtnLoading] = useState<boolean>(false)

  const [capitalPoolAddress, setCapitalPoolAddress] = useState<string>('')

  const [capitalPoolLoading, setCapitalPoolLoading] = useState<boolean>(false)

  const [repaymentPoolLoading, setRepaymentPoolLoading] = useState<boolean>(false)

  const [createLoading, setCreateLoading] = useState<boolean>(false)

  const [loanRequisitionEditModel, setLoanRequisitionEditModel] = useState<LoanRequisitionEditModel>(new LoanRequisitionEditModel())

  const [coin] = useState([
    {
      icon: '',
      coin: 'BTC',
    },
    {
      icon: '',
      coin: 'XRP',
    },
    {
      icon: '',
      coin: 'SQL',
    },
    {
      icon: '',
      coin: 'XRP',
    },
    {
      icon: '',
      coin: 'ETH',
    },
    {
      icon: '',
      coin: 'SQL',
    },
  ])

  async function reSet() {
    // 重置
    try {
      await followCapitalPoolContract?.initCreateTrade()
    }
    catch (error) {
      console.log('%c [ error ]-75', 'font-size:13px; background:#69bdf3; color:#adffff;', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        window.ethereum.on('accountsChanged', () => {
          window.location.reload()
          // form.resetFields()
          // setCapitalPoolChecked(false)
          // setRepaymentPoolChecked(false)
          // console.log('%c [  window.location.reload() ]-88', 'font-size:13px; background:#068b54; color:#4acf98;')
        })

        const followFactoryContract = await BrowserContractService.getFollowFactoryContract()

        const signer = await BrowserContractService.getSigner()

        const capitalPoolAddress = await followFactoryContract?.AddressGetCapitalPool(signer?.address ?? '')

        setCapitalPoolAddress(capitalPoolAddress)
        console.log('%c [ capitalPoolAddress ]-94', 'font-size:13px; background:#81a282; color:#c5e6c6;', capitalPoolAddress)

        const followCapitalPoolContract = await BrowserContractService.getFollowCapitalPoolContract(capitalPoolAddress!)

        setFollowCapitalPoolContract(followCapitalPoolContract)

        setSigner(signer)

        setFollowFactoryContract(followFactoryContract)
      }
      catch (error) {
        console.error('Error:', error)
      }
    }

    fetchData()
  }, [])

  async function checkDoublePoolCreated() {
    console.log('%c [ signer ]-121', 'font-size:13px; background:#7230e5; color:#b674ff;', signer)

    try {
      console.log('%c [ await followFactoryContract?.getIfCreate(signer?.address ?? "") ]-125', 'font-size:13px; background:#ab79d9; color:#efbdff;', await followFactoryContract?.getIfCreate(signer?.address ?? ''))

      // 检查是否创建资金池
      if (!capitalPoolChecked) {
        setCapitalPoolLoading(true)
        const isCreated = (await followFactoryContract?.getIfCreate(signer?.address ?? '')) === BigInt(1)

        if (!isCreated) {
          setIsModalOpen(true)

          const res = await followFactoryContract?.magicNewCapitalPool(signer?.address ?? '')

          const result = await res?.wait()

          setCapitalPoolChecked(isCreated)

          if (result?.status === 1)
            setCapitalPoolChecked(true)
        }
        else {
          setCapitalPoolChecked(false)
        }

        setCapitalPoolLoading(false)
      }

      // 检查是否创建还款池
      if (!repaymentPoolChecked) {
        const followRefundFactoryContract = await BrowserContractService.getFollowRefundFactoryContract()

        const isCreated = (await followRefundFactoryContract.getIfCreateRefundPool(capitalPoolAddress ?? '')) === BigInt(1)
        if (!isCreated) {
          setRepaymentPoolLoading(true)
          setIsModalOpen(true)
          const res = await followRefundFactoryContract.createRefundPool()
          const result = await res?.wait()

          setRepaymentPoolChecked(isCreated)
          setRepaymentPoolLoading(false)

          if (result?.status === 1)
            setRepaymentPoolChecked(true)
        }
        else {
          setRepaymentPoolChecked(false)
        }
      }

      setPublishBtnLoading(false)
    }
    catch (error) {
      message.error(JSON.stringify(error))
      console.log('%c [ error ]-61', 'font-size:13px; background:#c95614; color:#ff9a58;', error)
    }
  }

  const onFinish = async (value: LoanRequisitionEditModel) => {
    setPublishBtnLoading(true)
    try {
      await checkDoublePoolCreated()

      setLoanRequisitionEditModel(value)
      setPublishBtnLoading(false)
      setIsModalOpen(true)
    }
    catch (error) {
      console.log('%c [ error ]-61', 'font-size:13px; background:#c95614; color:#ff9a58;', error)
    }
  }

  const handleOk = async () => {
    setCreateLoading(true)

    try {
      checkDoublePoolCreated()

      if (capitalPoolChecked && repaymentPoolChecked) {
        loanRequisitionEditModel.raisingTime = loanRequisitionEditModel.raisingTime * 24 * 60 * 60

        const res = await followCapitalPoolContract?.createOrder(
          [BigInt(loanRequisitionEditModel.cycle),
            BigInt(loanRequisitionEditModel.period)],
          [BigInt(loanRequisitionEditModel.interest),
            BigInt(loanRequisitionEditModel.dividend),
            BigInt(loanRequisitionEditModel.numberOfCopies),
            BigInt(loanRequisitionEditModel.minimumRequiredCopies)],
          BigInt(loanRequisitionEditModel.raisingTime),
          BigInt(loanRequisitionEditModel.applyLoan),
        )

        const result = await res?.wait()

        if (result?.status === 1)
          navigate('/my-loan')

        console.log('%c [ result ]-180', 'font-size:13px; background:#b79c17; color:#fbe05b;', result)
      }
    }
    catch (error) {
      message.error(JSON.stringify(error))
      console.log('%c [ error ]-99', 'font-size:13px; background:#daf6df; color:#ffffff;', error)
    }
    finally {
      setCreateLoading(false)
    }
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
      <Button onClick={reSet}>重置（test）</Button>
      <Modal
       footer={(_, { OkBtn, CancelBtn }) => (
        <>
          {/* <Button>Custom Button</Button> */}
          <CancelBtn />
          <Button onClick={handleOk} loading={createLoading} disabled ={repaymentPoolLoading || capitalPoolLoading}>Confirm</Button>
        </>
       )}
       confirmLoading={createLoading} okText="Create" width={1164} maskClosable={false} open={isModalOpen} onCancel={handleCancel}>
        <div className='mt165 box-border h-300 w-full text-center text-16'>
          <p>
            Please confirm that it cannot be modified after submission.
          </p>
          <p>
            Creating the document requires gas fees to create:
          </p>

          <div>

            {capitalPoolLoading
              ? <Button
                type="primary"
                loading={capitalPoolLoading}
              />
              : null

            }
            <Checkbox disabled checked={capitalPoolChecked} onChange={onChange}>Capital pool contract</Checkbox>
          </div>

          <div>
            {
              capitalPoolChecked && repaymentPoolLoading
                ? <Button
                  type="primary"
                  loading={capitalPoolChecked && repaymentPoolLoading}
                />
                : null
            }
            <Checkbox disabled checked={repaymentPoolChecked} onChange={onChange}>Create a repayment pool</Checkbox>
          </div>
        </div>

      </Modal>
      <div className="h112"></div>
      <Form
        form={form}
        // initialValues={loanRequisitionEditModel}
        layout='vertical'
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        name="apply-loan-form"
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
              name="itemTitle"
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
            name="applyLoan"
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
            name='cycle'
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
              options={[{ value: 0, label: 10 }, { value: 1, label: 20 }, { value: 2, label: 30 }, { value: 3, label: 60 }, { value: 4, label: 90 }, { value: 5, label: 180 }]}
            />
          </Form.Item>

          <Form.Item
            name='period'
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
            name='numberOfCopies'
            initialValue={1}
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
            name='minimumRequiredCopies'
            initialValue={1}
            label={<span className="text-24">{t('applyLoan.formItem.minimumRequiredCopies.label')}</span>} >
            <InputNumber
              defaultValue={1}
              // min={2}
              max={10000}
              className='box-border h68 w412 items-center s-container px-30 pr-106 text-24'
              suffix={
                <div className='px-20 text-24'>share</div>
              }
            />
          </Form.Item>

          <Form.Item
            name='interest'
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
            name='dividend'
            initialValue={0}
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
            name='raisingTime'
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
            initialValue={true}
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
              defaultValue={true}
              options={[{ value: true, label: 'YES' }, { value: false, label: 'NO' }]}
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
              options={[{ value: 'SpotGoods', label: 'Spot goods' }]}
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
              options={[{ value: 'Uniswap', label: 'Uniswap' }]}
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
              options={[{ value: 'lucy', label: 'Lucy' }]}
            />
          </Form.Item>
        </div>

        <div className='h50' />

        <div className='flex gap-x-64'>
          {coin.map((e, i) => <div key={i} className='h68 w180 s-container text-center text-24 line-height-70'>{e.coin}</div>)}
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
