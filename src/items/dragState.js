export default class DragState {
  constructor(sourceContext, targetContext, isSameContext, insertBefore) {
    this.sourceContext = sourceContext
    this.targetContext = targetContext
    this.sameContext = isSameContext
    this.insertBefore = insertBefore
  }
}
