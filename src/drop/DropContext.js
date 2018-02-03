export default class DropContext {
  constructor(container, updateFn, needsUpdate) {
    this.container = container
    this.updateFn = updateFn
    this.needsUpdate = needsUpdate
  }
}
