export default class DropResult  {
  constructor(sourceResult, targetResult, targetContext, sameContext) {
    this.srcRes = sourceResult
    this.trgRes = targetResult
    this.trgCtx = targetContext
    this.sameContext = sameContext
  }
}
