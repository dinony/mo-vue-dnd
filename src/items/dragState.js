export default class DragState {
  constructor(sourceContext, targetContext, sameContext, insertBefore, resultFn) {
    this.sourceContext = sourceContext
    this.targetContext = targetContext
    this.sameContext = sameContext
    this.insertBefore = insertBefore
    this.resultFn = resultFn
  }

  equals(other) {
    return this.insertBefore === other.insertBefore &&
      this.sourceContext.equals(other.sourceContext) &&
      this.targetContext.equals(other.targetContext)
  }
}
