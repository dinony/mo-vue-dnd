export default class DragState {
  constructor(sourceContext, targetContext, isSameContext) {
    this.sourceContext = sourceContext
    this.targetContext = targetContext
    this.sameContext = isSameContext
  }
}
