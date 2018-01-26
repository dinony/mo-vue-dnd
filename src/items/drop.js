import DropContext from './dropContext'
import DropResult from './dropResult'

export function drop(dragState, cloneItem=true) {
  const ds = dragState
  const sc = ds.sourceContext
  const tc = ds.targetContext

  const handleClone = context => cloneItem ? context.options.cloneItemFn(context.item) : context.item
  const selfDrop = () => ds.sameContext && sc.index === tc.index

  const fallbackResultFn = () => {
    return new DropResult(
      new DropContext(sc.container.slice(), sc.updateFn),
      new DropContext(tc.container.slice(), tc.updateFn),
      ds.sameContext, false)
  }

  const sPerms = sc.options.permissions
  const tPerms = tc.options.permissions
  const sAllowsOut = sPerms.out === null || sPerms.out[tc.group]
  const tAllowsIn = tPerms.in === null || tPerms.in[sc.group]
  if(!sAllowsOut || !tAllowsIn) {
    return fallbackResultFn()
  }

  if(ds.sameContext && !selfDrop() && sc.options.allowSameContainer) {
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
      const newSrc = sc.container.slice(0, tc.index)
        .concat(handleClone(sc))
        .concat(sc.container.slice(tc.index, sc.index))
        .concat(sc.container.slice(sc.index+1))

      // source is same as traget
      const dc = new DropContext(newSrc, sc.updateFn)
      return new DropResult(
        dc, dc,
        ds.sameContext, true)
    }
  } else if(!ds.sameContext) {
    const newSrc = sc.options.allowItemRemoval ?
      sc.container.slice(0, sc.index).concat(sc.container.slice(sc.index+1)):
      sc.container.slice()

    const newTrg = tc.container.slice(0, tc.index)
      .concat(handleClone(sc))
      .concat(tc.container.slice(tc.index))

    return new DropResult(
      new DropContext(newSrc, sc.updateFn),
      new DropContext(newTrg, tc.updateFn),
      ds.sameContext, true)
  } else {
    return fallbackResultFn()
  }
}
