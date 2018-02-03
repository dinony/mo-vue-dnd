import DropResult from './DropResult'

export default function drop(itemIntersection, cloneItem=true) {
  const ii = itemIntersection
  const sc = ii.sourceContext
  const tc = ii.targetContext

  const clonedItem = () => cloneItem ? sc.options.cloneItemFn(sc.item, sc.group) : sc.item
  const trgIndex = ii.insertBefore ? tc.index: tc.index+1

  if(ii.sameContext) {
    // source=traget
    let trgResult = null
    let needsUpdate = true
    if(sc.index === tc.index) {
      trgResult = sc.container
      needsUpdate = false
    } else if(sc.index < tc.index) {
      if(ii.insertBefore && sc.index === tc.index-1) {
        trgResult = sc.container
        needsUpdate = false
      } else {
        trgResult = sc.container.slice(0, sc.index)
          .concat(sc.container.slice(sc.index+1, trgIndex))
          .concat(clonedItem())
          .concat(sc.container.slice(trgIndex))
      }
    } else {
      if(!ii.insertBefore && sc.index === tc.index+1) {
        trgResult = sc.container
        needsUpdate = false
      } else {
        trgResult = sc.container.slice(0, trgIndex)
          .concat(clonedItem())
          .concat(sc.container.slice(trgIndex, sc.index))
          .concat(sc.container.slice(sc.index+1))
      }
    }

    const dc = new DropContext(trgResult, sc.updateFn)
    return new DropResult(dc, dc, ii.sameContext, needsUpdate)
  } else {
    const srcResult = sc.options.allowItemRemoval ?
      sc.container.filter((val, index) => index !== sc.index):
      sc.container

    const trgResult = sc.container.slice(0, trgIndex)
      .concat(clonedItem())
      .concat(sc.container.slice(trgIndex))

    return new DropResult(
      new DropContext(srcResult, sc.updateFn),
      new DropContext(trgResult, sc.updateFn),
      ii.sameContext,
    true)
  }
}
