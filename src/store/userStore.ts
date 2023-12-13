import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User } from '@/models/User'

interface IUserState {
  activeUser: User
  userList: Array<User>
  setActiveUser(user: User): void
  addUser(user: User): void
  signIn(user: User): void
  switchActiveUser(user: User): void
  signOut(): void
  getToken: string | undefined
}

const useUserStore = create<IUserState>()(
  devtools(
    persist(
      (set, get) => ({
        activeUser: new User(),
        userList: [],
        get getToken(): string | undefined {
          return get().activeUser.accessToken
        },
        setActiveUser: user => set({ activeUser: user }),
        addUser: user => set({ userList: [...get().userList, user] }),
        signIn: (user) => {
          set((state) => {
            if (!state.userList.find(e => e.address === user.address))
              state.addUser(user)

            return { activeUser: user }
          })
        },
        signOut: () => {
          // Clear relevant state properties
          set({ activeUser: new User(), userList: [] })

          // Remove any stored information from local storage
          localStorage.removeItem('persist:userStore')
        },
        switchActiveUser: (user) => {
          set((state) => {
            if (!state.userList.find(e => e.address === user.address))
              state.addUser(user)

            return { activeUser: user }
          })
        },
      }),
      { name: 'userStore' },
    ),
  ),
)

export default useUserStore
