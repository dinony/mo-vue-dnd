// ItemContext
export default class ItemCtx {
  constructor(group, container, index, options, updateFn) {
    this.group = group
    this.cnt = container
    this.index = index
    this.options = options
    this.updateFn = updateFn
  }

  get item() {
    return this.cnt[this.index]
  }

  allowsDrop(srcCtx) {
    const sc = srcCtx
    const tc = this // this has target role
    const sPerms = sc.options.permissions
    const tPerms = tc.options.permissions
    const sAllowsOut = sPerms.out === null || sPerms.out[tc.group]
    const tAllowsIn = tPerms.in === null || tPerms.in[sc.group]
    return sAllowsOut && tAllowsIn
  }

  equals(other) {
    return this.group === other.group &&
      this.cnt === other.cnt &&
      this.index === other.index
  }
}
