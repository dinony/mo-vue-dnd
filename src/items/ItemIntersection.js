export default class ItemIntersection {
  constructor(sourceContext, targetContext, insertBefore) {
    this.sourceContext = sourceContext
    this.targetContext = targetContext
    this.insertBefore = insertBefore
  }

  get isSameContext() {
    return this.sourceContext.container === this.targetContext.container
  }

  equals(other) {
    return this.insertBefore === other.insertBefore &&
      this.sourceContext.equals(other.sourceContext) &&
      this.targetContext.equals(other.targetContext)
  }
}
