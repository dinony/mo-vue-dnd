import DropContext from './dropContext'
import DropResult from './dropResult'

export function drop(dragState, cloneItem=true) {
  const ds = dragState
  const sc = ds.sourceContext
  const tc = ds.targetContext

  const handleClone = context => cloneItem ? context.options.cloneItemFn(context.item, context.group) : context.item

  const trgIndex = ds.insertBefore ? tc.index: tc.index+1

  if(ds.sameContext) {
    if(sc.index < tc.index) {
      const newSrc = sc.container.slice(0, sc.index)
        .concat(sc.container.slice(sc.index+1, tc.index+1))
        .concat(handleClone(sc))
        .concat(sc.container.slice(tc.index+1))

        // source is same as traget
      const dc = new DropContext(newSrc, sc.updateFn)
      return new DropResult(
        dc, dc,
        ds.sameContext, true)
    } else {
      const newSrc = sc.container.slice(0, trgIndex)
        .concat(handleClone(sc))
        .concat(sc.container.slice(trgIndex, sc.index))
        .concat(sc.container.slice(sc.index+1))

      // source is same as traget
      const dc = new DropContext(newSrc, sc.updateFn)
      return new DropResult(
        dc, dc,
        ds.sameContext, true)
    }
  } else {
    const newSrc = sc.options.allowItemRemoval ?
      sc.container.slice(0, sc.index).concat(sc.container.slice(sc.index+1)):
      sc.container.slice()

    const newTrg = tc.container.slice(0, trgIndex)
      .concat(handleClone(sc))
      .concat(tc.container.slice(trgIndex))

    return new DropResult(
      new DropContext(newSrc, sc.updateFn),
      new DropContext(newTrg, tc.updateFn),
      ds.sameContext, true)
  }
}
