import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { disconnect } from 'wagmi/actions'
import { User } from '@/models/User'

interface IUserState {
  activeUser: User
  userList: Array<User>
  setActiveUser(user: User): void
  addUser(user: User): void

  setUserInfo(user: User): void

  signIn(user: User): void

  signOut(): void

  switchActiveUser(user: User): void

  getToken: string | undefined

}

const useUserStore = create<IUserState>()(
  devtools(
    persist(
      set => ({
        activeUser: new User(),
        userList: [],
        get getToken(): string | undefined {
          return this.activeUser.accessToken
        },
        setActiveUser: user => set(state => ({ activeUser: user })),

        setUserInfo: (user) => {
          set((state) => {
            state.activeUser = { ...state.activeUser, ...user }

            const index = state.userList.findIndex(e => e.address === user.address)

            if (index > -1)
              state.userList[index] = user
            else state.userList = [...state.userList, user]

            return ({
              activeUser: state.activeUser,
              userList: state.userList,
            })
          })
        },

        addUser: user => set(state => ({ userList: [...state.userList, user].filter(e => e?.id) })),

        signIn(user: User) {
          set((state) => {
            // if (!state.userList.find(e => e.address === user.address))
            //   state.addUser(user)

            state.setActiveUser(user)

            return ({ activeUser: user })
          })
        },

        signOut: async () => {
          await disconnect()

          set(state => ({ activeUser: new User() }))

          // localStorage.removeItem('persist:userStore')
        },

        switchActiveUser(user: User) {
          set((state) => {
            if (!state.userList.find(e => e.address === user.address))
              state.addUser(user)

            state.setActiveUser(user)
            return ({ activeUser: user })
          })
        },
      }),
      { name: 'userStore' },
    ),
  ),
)

export default useUserStore
