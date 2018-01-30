import {DnDOptions} from 'mo-vue-dnd'

export const LEFT_GRP = 'left'
export const RIGHT_GRP = 'right'

export const leftOptions = new DnDOptions()
leftOptions.cloneItemFn = item => item
leftOptions.permissions = [
  [],
  [RIGHT_GRP]
]

export const rightOptions = new DnDOptions()
rightOptions.cloneItemFn = node => {
  return node
}
rightOptions.permissions = [
  [LEFT_GRP, RIGHT_GRP],
  [RIGHT_GRP]
]
