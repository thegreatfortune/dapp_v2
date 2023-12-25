import { Models } from '@/.generated/api/models'

export class User extends Models.UserInfoVo1 {
  id?: string
  // address?: string
  accessToken?: string

  chainId?: number = 1
}
