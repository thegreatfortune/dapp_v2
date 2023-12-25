import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { disconnect } from 'wagmi/actions'
import { ethers } from 'ethers'
import { User } from '@/models/User'

interface IUserState {
  activeUser: User
  userList: Array<User>
  setActiveUser(user: User): void
  addUser(user: User): void

  setUserInfo(user: User): void

  signIn(user: User): void

  signOut(): void

  clear(): void

  switchActiveUser(user: User): void

  getToken: string | undefined

}

const useUserStore = create<IUserState>()(
  devtools(
    persist(
      (set, get) => ({
        activeUser: new User(),
        userList: [],
        get getToken(): string | undefined {
          return this.activeUser.accessToken
        },
        setActiveUser: user => set(state => ({ activeUser: user })),

        setUserInfo: (user) => {
          set((state) => {
            const updateUser = { ...get().activeUser, ...user }

            let updateUserList = [...get().userList]

            const index = updateUserList.findIndex(e => ethers.getAddress(e.address ?? '') === ethers.getAddress(user.address ?? ''))

            if (index > -1)
              updateUserList[index] = user
            else updateUserList = [...get().userList, user]

            return ({
              activeUser: updateUser,
              userList: updateUserList,
            })
          })
        },

        addUser: user => set(state => ({ userList: [...get().userList, user] })),

        signIn(user: User) {
          set((state) => {
            if (!get().userList.find(e => ethers.getAddress(e.address ?? '') === ethers.getAddress(user.address ?? '')) && user?.id)
              get().addUser(user)

            get().setActiveUser(user)

            return ({ activeUser: user })
          })
        },

        clear: () => {
          set(state => ({ activeUser: new User() }))

          set(state => ({ userList: [] }))

          // localStorage.removeItem('persist:userStore')
          // localStorage.removeItem('userStore')
          // localStorage.clear()
        },

        signOut: async () => {
          await disconnect()

          set(state => ({ activeUser: new User() }))

          // localStorage.removeItem('persist:userStore')
        },

        switchActiveUser(user: User) {
          get().signIn(user)

          // set((state) => {
          //   const localUser = get().userList.find(e => e.address === user.address)

          //   // if (!state.userList.find(e => e.address === user.address))
          //   //   state.addUser(user)

          //   // state.setActiveUser(user)
          //   return ({ activeUser: user })
          // })
        },
      }),
      { name: 'userStore' },
    ),
  ),
)

export default useUserStore
