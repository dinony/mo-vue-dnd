export default class ItemContext {
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

  allowsDrop(sourceContext) {
    const tc = this // this has drop target role
    const sc = sourceContext
    const sPerms = sc.options.permissions
    const tPerms = tc.options.permissions
    const sAllowsOut = sPerms.out === null || sPerms.out[tc.group]
    const tAllowsIn = tPerms.in === null || tPerms.in[sc.group]
    return sAllowsOut && tAllowsIn
  }

  equals(other) {
    return this.group === other.group &&
      this.container === other.container &&
      this.index === other.index
  }
}
