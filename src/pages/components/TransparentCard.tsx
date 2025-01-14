import Avatar from 'antd/es/avatar'
import BigNumber, { } from 'bignumber.js'
import { Badge, Image, Tooltip } from 'antd'
import { Models } from '@/.generated/api/models'
import infoIconIcon from '@/assets/images/apply-loan/InfoIcon.png'
import { isContractAddress } from '@/utils/regex'
import { maskAddress } from '@/utils/maskAddress'
import tlogo from '@/assets/images/portalImages/tLogo.png'

interface CardProps {
  item: Models.ILoanOrderVO
  children?: React.ReactNode
  btnText?: string
  copies?: number
}

interface CustomAvatarProps {
  src: string
  name: string
  twitter: string
}

// TODO 自动缩放，不定长宽，只锁定长宽比例

const CustomAvatar: React.FC<CustomAvatarProps> = ({ src, name, twitter }) => {
  return (
    <div className="flex items-center">
      <Avatar src={src} className='h40 w40' />
      {
        name && twitter
          ? <div className="ml-4">
            <h2 className="m0 p0 text-12 font-semibold">{isContractAddress(name ?? '') ? maskAddress(name, 3) : name}</h2>
            <span className="text-10 text-gray-500">@{twitter}</span>
          </div>
          : 'Not bound'
      }
    </div>
  )
}

const TransparentCard: React.FC<CardProps> = ({ item, children, btnText, copies }) => {
  return (
    <div className="card relative box-border w-300 flex flex-col cursor-pointer border-2 border-#303241 rounded-15 border-solid">
      {/* <div className="card box-border flex flex-col cursor-pointer border-2 border-#303241 rounded-16 border-solid bg-[#171822]"> */}
      {/* <img
        src={item?.picUrl}
        alt={item.loanName}
        className="h-232 w-266 rounded-16 object-cover"
        onError={({ currentTarget }) => {
          currentTarget.onerror = null
          currentTarget.src = cardPic
        }}
      /> */}
      <div className='absolute left-15 top-10 text-slate-500 font-semibold'>ID: {item.tradeId}</div>
      <div className='rounded-t-15 bg-[#F1F8FF]'>
        <Image
          preview={false}
          // src={item?.picUrl}
          src={tlogo}
          alt={item.loanName}
          className="rounded-t-15 object-cover"
        // width={300}
        // height={261}
        // placeholder={
        //   <Image
        //     preview={false}
        //     className='blur-sm'
        //     src={cardPic}
        //     width={300}
        //   />
        // }
        // fallback={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=='}
        />
      </div>
      <div className='px-20 pb-10 pt-15'
      // style={{
      //   backgroundImage: 'linear-gradient(120deg, #171822 0%, #7e7f7d 80%, #4f504f 100%)',
      // }}
      >
        <div className='h10 w-full'></div>
        <div className='flex justify-between'>
          <h2 className="m0 h35 w-100 flex items-center truncate p0 text-20 c-#37A4F8 font-semibold">{item.loanName}</h2>
          <div className='flex items-center'>
            <Badge dot={item.state === 'PaidButArrears'}>
              <div className={`rounded-5 px-5 text-14 h-30 flex items-center ${Models.LoanStateEnums[item.state!].bgColor}`}>{Models.LoanStateEnums[item.state!].state}</div>
            </Badge>
          </div>
        </div>
        <div className='h8 w-full'></div>

        <div className='flex justify-between'>
          <ul className='m0 flex flex-col list-none gap-8 p0'>
            <li className='h18 flex flex-col text-14 c-#999999'>
              Loan Amount
            </li>
            <li className='h29 text-17 c-#FFFFFF font-mono slashed-zero'>
              ${Number.parseFloat(BigNumber(item.loanMoney ?? 0).div(BigNumber(10 ** 18)).toFixed(2)).toLocaleString()}
            </li>
            {/* <li>
              {children ?? <CustomAvatar
                src={item.userInfo?.pictureUrl ? item.userInfo?.pictureUrl : logo}
                name={item.userInfo?.nickName ?? 'NOT BOUND'}
                twitter={item.userInfo?.platformName ?? 'Not bound'} />}
            </li> */}
          </ul>
          <ul className='m0 flex flex-col list-none items-end gap-8 p0'>
            <li className='h18 flex flex-col text-14 c-#999999'>
              {copies ? `Share ${copies}` : 'Risk Level'}
            </li>
            <li className='mr-5 h29 flex text-16 c-#FFFFFF' style={{ color: item.tradingForm !== Models.SpecifiedTradingTypeEnum.Spot ? 'red' : '#FFFFFF' }}>
              {item.tradingForm === Models.SpecifiedTradingTypeEnum.Spot ? 'Low' : 'High'}
              <Tooltip color='#303241' overlayInnerStyle={{ padding: 25, width: 349 }}
                title={
                  <div>
                    1. Low-risk loan funds can only be designated for spot transactions,
                    and spot transactions can be liquidated to obtain repayment funds;
                    <br />
                    <br />
                    2. High-risk loan funds can be used to trade contracts,
                    which involves the risk of liquidation; loan funds can also be withdrawn,
                    requiring the borrower to actively recharge for repayment.
                  </div>
                }
              >
                <Image className='ml-5 cursor-help' width={16} height={16} src={infoIconIcon} preview={false} />
              </Tooltip>
            </li>
            <li>
              {/* <Button className='mt-10 h30 w-110 text-14 primary-btn'>{btnText ?? 'Follow'}</Button> */}
              {/* <Button className='mt-10 h30 w-110 text-12 primary-btn'>{btnText ?? 'Follow'}</Button> */}
            </li>
          </ul>
        </div>
      </div>
    </div >
  )
}

export default TransparentCard
