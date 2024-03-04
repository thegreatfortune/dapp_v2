import { Models } from '@/.generated/api/models'

export class LoanForm {
  name: string
  description: string = ''
  imageUrl: string = '' // 最终上传的地址
  projectImagePreViewUrl = ''
  projectImageFile: File | undefined
  loanAmount: number
  duration: number
  installments: number
  numberOfShares: number
  minimumRequiredRaisingShares: number
  interest: number
  dividend: number
  raisingTime: number
  specified: boolean
  specifiedTradingType: Models.SpecifiedTradingType
  specifiedPlatformType: Models.SpecifiedTradingPlatformType
  specifiedPairs: string[]
  platforms?: 'Twitter'[]

  constructor() {
    this.name = ''
    this.description = ''
    this.imageUrl = ''
    this.projectImagePreViewUrl = ''
    this.loanAmount = 1000
    this.duration = 0
    this.installments = 1
    this.numberOfShares = 1
    this.minimumRequiredRaisingShares = 1
    this.interest = 5
    this.dividend = 0
    this.raisingTime = 1
    this.specified = true
    this.specifiedTradingType = Models.SpecifiedTradingTypeEnum.Spot
    this.specifiedPlatformType = Models.SpecifiedTradingPlatformTypeEnum.Uniswap
    this.specifiedPairs = ['BTC']
  }
}
