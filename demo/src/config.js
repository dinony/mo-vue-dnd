import {DnDOptions} from 'mo-vue-dnd'

export const LEFT_GRP = 'left'
export const RIGHT_GRP = 'right'

export const leftOptions = new DnDOptions(false)
leftOptions.cloneItemFn = item => item
leftOptions.permissions = [
  [LEFT_GRP],
  [RIGHT_GRP, LEFT_GRP]
]
leftOptions.cloneItemFn = (item, targetGroup) => {
  // Adapt cloneItemFn to create node instances
  // when dropped into right column
  return targetGroup === RIGHT_GRP ? item.nodeFactory() : item
}

export const rightOptions = new DnDOptions()
rightOptions.cloneItemFn = node => {
  // Do no clone on the right side
  // Just pass reference
  return node
}
rightOptions.permissions = [
  [LEFT_GRP, RIGHT_GRP],
  [RIGHT_GRP]
]
