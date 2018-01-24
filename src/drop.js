export class DropContext {
  constructor(container, updateFn) {
    this.container = container
    this.updateFn = updateFn
  }
}

export class DropResult {
  constructor(sourceResult, targetResult, sameContext, needsUpdate) {
    this.source = sourceResult
    this.target = targetResult
    this.sameContext = sameContext
    this.needsUpdate = needsUpdate
  }
}

export function drop(dragState) {
  const ds = dragState
  const sc = ds.sourceContext
  const tc = ds.targetContext

  const selfDrop = () => ds.sameContext && sc.index === tc.index

  if(ds.sameContext && !selfDrop() && sc.options.allowSameContainer) {
    if(sc.index < tc.index) {
      const newSrc = sc.container.slice(0, sc.index)
        .concat(sc.container.slice(sc.index+1, tc.index+1))
        .concat(sc.item)
        .concat(sc.container.slice(tc.index+1))

        // source is same as traget
      const dc = new DropContext(newSrc, sc.updateFn)
      return new DropResult(
        dc, dc,
        ds.sameContext, true)
    } else {
      const newSrc = sc.container.slice(0, tc.index)
        .concat(sc.item)
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
      .concat(sc.item)
      .concat(tc.container.slice(tc.index))

    return new DropResult(
      new DropContext(newSrc, sc.updateFn),
      new DropContext(newTrg, tc.updateFn),
      ds.sameContext, true)
  } else {
    return new DropResult(
      new DropContext(sc.container.slice(), sc.updateFn),
      new DropContext(tc.container.slice(), tc.updateFn),
      ds.sameContext, false)
  }
}
