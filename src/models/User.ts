import { Models } from '@/.generated/api/models'

export class User_Old extends Models.UserInfoVo1 {
  id?: string
  // address?: string
  accessToken?: string

  chainId?: number = 1
}

export interface IUser extends Models.IUserInfo {

  accessToken?: string

  chainId?: number

  nonce?: string
}
