import DropResult from './DropResult'
import DropContext from './DropContext'
import ItemContext from '../items/ItemContext'

export default function drop(itemIntersection) {
  const itemInt = itemIntersection
  const sc = itemInt.srcCtx
  const tc = itemInt.trgCtx

  const cloneItem = () => sc.options.cloneItemFn(sc.item, tc.grp)
  const trgIndex = itemInt.insBef ? tc.idx: tc.idx+1

  if(itemInt.isSameContext) {
    // source=traget
    let trgResult = null
    let needsUpdate = false
    if(sc.idx === tc.idx) {
      trgResult = sc.cnt
    } else if(sc.idx < tc.idx) {
      if(itemInt.insBef && sc.idx === tc.idx-1) {
        trgResult = sc.cnt
      } else {
        needsUpdate = true
        trgResult = sc.cnt.slice(0, sc.idx)
          .concat(sc.cnt.slice(sc.idx+1, trgIndex))
          .concat(cloneItem())
          .concat(sc.cnt.slice(trgIndex))
      }
    } else {
      if(!itemInt.insBef && sc.idx === tc.idx+1) {
        trgResult = sc.cnt
      } else {
        needsUpdate = true
        trgResult = sc.cnt.slice(0, trgIndex)
          .concat(cloneItem())
          .concat(sc.cnt.slice(trgIndex, sc.idx))
          .concat(sc.cnt.slice(sc.idx+1))
      }
    }

    let tItemIndex = null
    if(sc.idx < tc.idx) {
      tItemIndex = itemInt.insBef ? tc.idx-1: tc.idx
    } else if(sc.idx > tc.idx) {
      tItemIndex = itemInt.insBef ? tc.idx: tc.idx+1
    } else {
      tItemIndex = tc.idx
    }

    // const sd = td (source = target)
    const td = new DropContext(trgResult, sc.updateFn, needsUpdate)
    const tItemContext = new ItemContext(tc.grp, trgResult, tItemIndex, tc.options, tc.updateFn)
    return new DropResult(td, td, tItemContext, true)
  } else {
    const srcResult = sc.options.allowItemRemoval ?
      sc.cnt.filter((val, index) => index !== sc.idx):
      sc.cnt

    const trgResult = tc.cnt.slice(0, trgIndex)
      .concat(cloneItem())
      .concat(tc.cnt.slice(trgIndex))

    const sd = new DropContext(srcResult, sc.updateFn, sc.options.allowItemRemoval)
    const td = new DropContext(trgResult, tc.updateFn, true)
    const tItemIndex = itemInt.insBef ? tc.idx: tc.idx+1
    const tItemContext = new ItemContext(tc.grp, trgResult, tItemIndex, tc.options, tc.updateFn)
    return new DropResult(sd, td, tItemContext, false)
  }
}
