export default class DragState {
  constructor(sourceContext, targetContext, sameContext, insertBefore, resultFn) {
    this.sourceContext = sourceContext
    this.targetContext = targetContext
    this.sameContext = sameContext
    this.insertBefore = insertBefore
    this.resultFn = resultFn
  }
}
