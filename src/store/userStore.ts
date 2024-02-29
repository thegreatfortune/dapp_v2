import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ZeroAddress, ethers } from 'ethers'
import type { User } from '@/models/User'

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

  currentUser: User

  users: User[]

  userLogin(user: User): void

  userLogout(): void

  addUserV1(user: User): void

  updateUser(user: User): void
}

const useUserStore = create<IUserState>()(
  devtools(
    persist(
      set => ({
        // activeUser: new User(),
        // userList: [],
        // get getToken(): string | undefined {
        //   return this.activeUser.accessToken
        // },
        // setActiveUser: user => set(() => ({ activeUser: user })),
        // unSetActiveUser: () => set(() => ({ activeUser: new User() })),

        // unSetUserList: () => set(() => ({ userList: [] })),

        // setUserInfo: (user) => {
        //   set(() => {
        //     const updateUser = { ...get().activeUser, ...user }

        //     let updateUserList = [...get().userList]

        //     const index = updateUserList.findIndex(e => ethers.getAddress(e.address ?? '') === ethers.getAddress(user.address ?? ''))

        //     if (index > -1)
        //       updateUserList[index] = user
        //     else updateUserList = [...get().userList, user]

        //     return ({
        //       activeUser: updateUser,
        //       userList: updateUserList,
        //     })
        //   })
        // },

        // addUser: user => set(() => ({ userList: [...get().userList, user] })),

        // signIn(user: User) {
        //   set(() => {
        //     if (!get().userList.find(e => ethers.getAddress(e.address ?? '') === ethers.getAddress(user.address ?? '')) && user?.id)
        //       get().addUser(user)
        //     get().setActiveUser(user)
        //     return ({ activeUser: user })
        //   })
        // },

        // clear: () => {
        //   get().unSetActiveUser()
        //   get().unSetUserList()
        // },

        // signOut: async () => {
        //   set(() => ({ activeUser: new User() }))
        // },

        currentUser: { address: ZeroAddress },
        users: [],
        userLogin: user => set((state) => {
          state.updateUser(user)
          const updatedUser = state.users.find(e => e.address === ethers.getAddress(user.address))
          return ({ currentUser: updatedUser! })
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
