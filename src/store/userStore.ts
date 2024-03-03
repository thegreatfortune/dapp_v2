import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ZeroAddress, ethers } from 'ethers'
import type { IUser } from '@/models/User'

interface IUserState {
  // activeUser: User
  // userList: Array<User>
  // getToken: string | undefined
  // setActiveUser(user: User): void
  // unSetActiveUser(): void
  // unSetUserList(): void
  // addUser(user: User): void
  // setUserInfo(user: User): void
  // clear(): void
  // signIn(user: User): void
  // signOut(): void

  currentUser: IUser

  users: IUser[]

  userLogin(user: IUser): void

  userLogout(): void

  addUserV1(user: IUser): void

  updateUser(user: IUser): void
}

const useUserStore = create<IUserState>()(
  devtools(
    persist(
      set => ({
        currentUser: { address: ZeroAddress },
        users: [],
        userLogin: user => set((state) => {
          state.updateUser(user)
          // const updatedUser = state.users.find(e => e.address === ethers.getAddress(user.address))
          return ({ currentUser: user })
        }),
        userLogout: () => set(() => ({ currentUser: { address: ZeroAddress } })),
        addUserV1: user => set((state) => {
          if (state.users.find(e => e.address === ethers.getAddress(user.address)))
            return { users: state.users }
          return { users: [...state.users, { ...user, address: ethers.getAddress(user.address) }] }
        }),
        updateUser: user => set((state) => {
          const userIndex = state.users.findIndex(e => e.address === ethers.getAddress(user.address))
          if (userIndex !== -1)
            state.users[userIndex] = { ...state.users[userIndex], ...user }
          else
            state.users.push(user)
          return { users: state.users }
        }),
      }),
      { name: 'userStore' },
    ),
  ),
)

export default useUserStore
