export default class DragState {
  constructor(sourceContext, targetContext, sameContext, insertBefore) {
    this.sourceContext = sourceContext
    this.targetContext = targetContext
    this.sameContext = sameContext
    this.insertBefore = insertBefore
  }
}
