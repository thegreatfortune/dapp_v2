import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User } from '@/models/User'

interface IUserState {
  activeUser: User
  userList: Array<User>
  setActiveUser(user: User): void
  addUser(user: User): void
  //   removeUser(userId: string): void
  //   updateUser(user: User): void

  signIn(user: User): void

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
        addUser: user => set(state => ({ userList: [...state.userList, user] })),

        signIn(user: User) {
          set((state) => {
            if (!state.userList.find(e => e.address === user.address))
              state.addUser(user)

            return ({ activeUser: user })
          })
        },

        switchActiveUser(user: User) {
          set((state) => {
            if (!state.userList.find(e => e.address === user.address))
              state.addUser(user)
            return ({ activeUser: user })
          })
        },
      }),
      { name: 'userStore' },
    ),
  ),
)

export default useUserStore
