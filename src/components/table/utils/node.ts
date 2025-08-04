import type { ProNode } from '../types'

export const renderProNode = (node?: ProNode, ...args: unknown[]) => {
  if (!node) return null
  if (typeof node === 'string') {
    return node
  }
  return node(...args)
}
