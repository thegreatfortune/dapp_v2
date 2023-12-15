import { Models } from '@/.generated/api/models'

export class User extends Models.UserInfoVo1 {
  id?: number
  // address?: string
  accessToken?: string
}
