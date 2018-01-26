export default class DragContext {
  constructor(group, container, index, options, updateFn) {
    this.container = container
    this.group = group
    this.index = index
    this.options = options
    this.updateFn = updateFn
  }

  get item() {
    return this.container[this.index]
  }
}
