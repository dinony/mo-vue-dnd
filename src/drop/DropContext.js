export default class DropContext {
  constructor(container, updateFn, needsUpdate) {
    this.cnt = container
    this.updateFn = updateFn
    this.needsUpdate = needsUpdate
  }

  update() {
    if(this.needsUpdate) {
      this.updateFn(this.cnt)
    }
  }
}
