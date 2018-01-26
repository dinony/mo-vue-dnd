export default class DropResult {
  constructor(sourceResult, targetResult, sameContext, needsUpdate) {
    this.source = sourceResult
    this.target = targetResult
    this.sameContext = sameContext
    this.needsUpdate = needsUpdate
  }
}
