// Base class for mappings between source and target contexts
export default class Relation {
  constructor(sourceContext, targetContext) {
    this.sourceContext = sourceContext
    this.targetContext = targetContext
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
