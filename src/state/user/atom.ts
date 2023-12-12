import { ASSETS } from '@/constants'
import { atom } from 'recoil'
import type { UserState } from './state'

// Todo: Comment
export const userAtom = atom<UserState>(
  {
    key: 'userAtom',
    default: {
      state: {
        assets: ASSETS
      },
      loading: true,
      error: null
    }
  }
)
