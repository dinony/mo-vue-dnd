import DropResult from './DropResult'
import DropContext from './DropContext'
import ItemContext from '../items/ItemContext'

export default function drop(itemIntersection) {
  const itemInt = itemIntersection
  const sc = itemInt.srcCtx
  const tc = itemInt.trgCtx

  const cloneItem = () => sc.options.cloneItemFn(sc.item, tc.group)
  const trgIndex = itemInt.insertBefore ? tc.index: tc.index+1

  if(itemInt.isSameContext) {
    // source=traget
    let trgResult = null
    let needsUpdate = false
    if(sc.index === tc.index) {
      trgResult = sc.cnt
    } else if(sc.index < tc.index) {
      if(itemInt.insertBefore && sc.index === tc.index-1) {
        trgResult = sc.cnt
      } else {
        needsUpdate = true
        trgResult = sc.cnt.slice(0, sc.index)
          .concat(sc.cnt.slice(sc.index+1, trgIndex))
          .concat(cloneItem())
          .concat(sc.cnt.slice(trgIndex))
      }
    } else {
      if(!itemInt.insertBefore && sc.index === tc.index+1) {
        trgResult = sc.cnt
      } else {
        needsUpdate = true
        trgResult = sc.cnt.slice(0, trgIndex)
          .concat(cloneItem())
          .concat(sc.cnt.slice(trgIndex, sc.index))
          .concat(sc.cnt.slice(sc.index+1))
      }
    }

    let tItemIndex = null
    if(sc.index < tc.index) {
      tItemIndex = itemInt.insertBefore ? tc.index-1: tc.index
    } else if(sc.index > tc.index) {
      tItemIndex = itemInt.insertBefore ? tc.index: tc.index+1
    } else {
      tItemIndex = tc.index
    }

    // const sd = td (source = target)
    const td = new DropContext(trgResult, sc.updateFn, needsUpdate)
    const tItemContext = new ItemContext(tc.group, trgResult, tItemIndex, tc.options, tc.updateFn)
    return new DropResult(td, td, tItemContext, true)
  } else {
    const srcResult = sc.options.allowItemRemoval ?
      sc.cnt.filter((val, index) => index !== sc.index):
      sc.cnt

    const trgResult = tc.cnt.slice(0, trgIndex)
      .concat(cloneItem())
      .concat(tc.cnt.slice(trgIndex))

    const sd = new DropContext(srcResult, sc.updateFn, sc.options.allowItemRemoval)
    const td = new DropContext(trgResult, tc.updateFn, true)
    const tItemIndex = itemInt.insertBefore ? tc.index: tc.index+1
    const tItemContext = new ItemContext(tc.group, trgResult, tItemIndex, tc.options, tc.updateFn)
    return new DropResult(sd, td, tItemContext, false)
  }
}
