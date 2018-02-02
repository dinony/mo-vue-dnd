import DropContext from './dropContext'
import DropResult from './dropResult'

export function drop(dragState, cloneItem=true) {
  const ds = dragState
  const sc = ds.sourceContext
  const tc = ds.targetContext

  const handleClone = context => cloneItem ? context.options.cloneItemFn(context.item, context.group) : context.item

  if(ds.sameContext) {
    // source=traget
    const trgIndex = ds.insertBefore ? tc.index: tc.index+1
    let trgResult = null

    if(sc.index < tc.index) {
      trgResult = sc.container.slice(0, sc.index)
        .concat(sc.container.slice(sc.index+1, trgIndex))
        .concat(handleClone(sc))
        .concat(sc.container.slice(trgIndex))
    } else {
      trgResult = sc.container.slice(0, trgIndex)
        .concat(handleClone(sc))
        .concat(sc.container.slice(trgIndex, sc.index))
        .concat(sc.container.slice(sc.index+1))
    }

    const dc = new DropContext(trgResult, sc.updateFn)
    return new DropResult(dc, dc, ds.sameContext)
  } else {
    // const srcCont = getContainer(sc)
    // const trgCont = getContainer(tc)

    // const newSrc = sc.options.allowItemRemoval ?
    //   srcCont.slice(0, sc.index).concat(srcCont.slice(sc.index+1)):
    //   srcCont.slice()

    // const newTrg = trgCont.slice(0, trgIndex)
    //   .concat(handleClone(sc))
    //   .concat(trgCont.slice(trgIndex))

    // return new DropResult(
    //   new DropContext(newSrc, sc.updateFn),
    //   new DropContext(newTrg, tc.updateFn),
    //   ds.sameContext)
  }
}
