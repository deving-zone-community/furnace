import { ASSETS } from '@/constants'
import type { Asset } from '@/types'

// Todo: Comment
export const selectAssetById = (id: string): Asset => ASSETS.find(asset => asset.id === id) ?? ASSETS[ASSETS.length - 1]
