export default class DropResult  {
  constructor(sourceResult, targetResult, targetContext, sameContext) {
    this.sourceResult = sourceResult
    this.targetResult = targetResult
    this.targetContext = targetContext
    this.sameContext = sameContext
  }
}
