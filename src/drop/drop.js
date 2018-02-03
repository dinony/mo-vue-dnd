import DropResult from './DropResult'
import DropContext from './DropContext'
import ItemContext from '../items/ItemContext'

export default function drop(itemIntersection) {
  const itemInt = itemIntersection
  const sc = itemInt.sourceContext
  const tc = itemInt.targetContext

  const cloneItem = () => sc.options.cloneItemFn(sc.item, sc.group)
  const trgIndex = itemInt.insertBefore ? tc.index: tc.index+1

  if(itemInt.sameContext) {
    // source=traget
    let trgResult = null
    let needsUpdate = false
    if(sc.index === tc.index) {
      trgResult = sc.container
    } else if(sc.index < tc.index) {
      if(itemInt.insertBefore && sc.index === tc.index-1) {
        trgResult = sc.container
      } else {
        needsUpdate = true
        trgResult = sc.container.slice(0, sc.index)
          .concat(sc.container.slice(sc.index+1, trgIndex))
          .concat(cloneItem())
          .concat(sc.container.slice(trgIndex))
      }
    } else {
      if(!itemInt.insertBefore && sc.index === tc.index+1) {
        trgResult = sc.container
      } else {
        needsUpdate = true
        trgResult = sc.container.slice(0, trgIndex)
          .concat(cloneItem())
          .concat(sc.container.slice(trgIndex, sc.index))
          .concat(sc.container.slice(sc.index+1))
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
    return new DropResult(td, td, tItemContext)
  } else {
    const srcResult = sc.options.allowItemRemoval ?
      sc.container.filter((val, index) => index !== sc.index):
      sc.container

    const trgResult = sc.container.slice(0, trgIndex)
      .concat(cloneItem())
      .concat(sc.container.slice(trgIndex))

    const sd = new DropContext(srcResult, sc.updateFn, sc.options.allowItemRemoval)
    const td = new DropContext(trgResult, tc.updateFn, true)
    const tItemIndex = itemInt.insertBefore ? tc.index: tc.index+1
    const tItemContext = new ItemContext(tc.group, trgResult, tItemIndex, tc.options, tc.updateFn)
    return new DropResult(sd, td, tItemContext)
  }
}
