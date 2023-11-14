import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface NavbarQuery {
  queryString: string | undefined
  updateQuery: (newQuery: string) => void
}

const useNavbarQueryStore = create<NavbarQuery>()(
  devtools(set => ({
    queryString: undefined,
    updateQuery: (newQueryString: string) =>
      set({ queryString: newQueryString }),
  })),
)

export default useNavbarQueryStore
