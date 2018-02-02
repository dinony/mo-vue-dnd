export default class DragContext {
  constructor(group, container, index, options, updateFn) {
    this.group = group
    this.container = container
    this.index = index
    this.options = options
    this.updateFn = updateFn
  }

  get item() {
    return this.container[this.index]
  }

  equals(other) {
    return this.group === other.group &&
      this.container === other.container &&
      this.index === other.index
  }
}
