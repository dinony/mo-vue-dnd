export default class DragContext {
  constructor(container, index, options, updateFn) {
    this.container = container
    this.index = index
    this.options = options
    this.updateFn = updateFn
  }

  get item() {
    return this.container[this.index]
  }
}
