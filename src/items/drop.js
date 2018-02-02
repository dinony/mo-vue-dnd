import DropContext from './dropContext'
import DropResult from './dropResult'

export function drop(dragState, cloneItem=true) {
  const ds = dragState
  const sc = ds.sourceContext
  const tc = ds.targetContext

  const clonedItem = cloneItem ? context.options.cloneItemFn(sc.item, sc.group) : sc.item
  const trgIndex = ds.insertBefore ? tc.index: tc.index+1

  if(ds.sameContext) {
    // source=traget
    let trgResult = null

    if(sc.index < tc.index) {
      trgResult = sc.container.slice(0, sc.index)
        .concat(sc.container.slice(sc.index+1, trgIndex))
        .concat(clonedItem)
        .concat(sc.container.slice(trgIndex))
    } else {
      trgResult = sc.container.slice(0, trgIndex)
        .concat(clonedItem)
        .concat(sc.container.slice(trgIndex, sc.index))
        .concat(sc.container.slice(sc.index+1))
    }

    const dc = new DropContext(trgResult, sc.updateFn)
    return new DropResult(dc, dc, ds.sameContext)
  } else {
    const srcResult = sc.options.allowItemRemoval ?
      sc.container.filter((val, index) => index !== sc.index):
      sc.container

    const trgResult = sc.container.slice(0, trgIndex)
      .concat(clonedItem)
      .concat(sc.container.slice(trgIndex))

    return new DropResult(
      new DropContext(srcResult, sc.updateFn),
      new DropContext(trgResult, sc.updateFn),
      ds.sameContext)
  }
}
