// ItemContext
export default class ItemCtx {
  constructor(group, container, index, options, updateFn) {
    this.grp = group
    this.cnt = container
    this.idx = index
    this.options = options
    this.updateFn = updateFn
  }

  get item() {
    return this.cnt[this.idx]
  }

  allowsDrop(srcCtx) {
    const sc = srcCtx
    const tc = this // this has target role
    const sPerms = sc.options.permissions
    const tPerms = tc.options.permissions
    const sAllowsOut = sPerms.out === null || sPerms.out[tc.grp]
    const tAllowsIn = tPerms.in === null || tPerms.in[sc.grp]
    return sAllowsOut && tAllowsIn
  }

  equals(other) {
    return this.grp === other.grp &&
      this.cnt === other.cnt &&
      this.idx === other.idx
  }
}
