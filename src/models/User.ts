import { Models } from '@/.generated/api/models'

export class User extends Models.UserInfoVo {
  id?: number
  // address?: string
  accessToken?: string
}
