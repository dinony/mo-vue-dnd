const cssPxRegex = /^(\d+(\.\d+)?)px$/
const cssPx = x => `${x}px`
const parseCSSPx = cssPxStr => cssPxRegex.exec(cssPxStr)

function cssPosToVec2(cssPosLike) {
  if(typeof cssPosLike.left === 'number' && typeof cssPosLike.top === 'number') {
    return new Vec2(cssPosLike.left, cssPosLike.top)
  } else {
    // cssPosLike instanceof CSSPos
    const x = parseCSSPx(cssPosLike.left)
    const y = parseCSSPx(cssPosLike.top)
    return x && y ? new Vec2(x, y) : null
  }
}

export class CSSPos {
  constructor(left, top) {
    this.left = cssPx(left)
    this.top = cssPx(top)
  }

  static fromVec2(vec2) {
    return new CSSPos(vec2.x, vec2.y)
  }

  static toVec2(cssPos) {
    return cssPosToVec2(cssPos)
  }

  toVec2() {
    return cssPosToVec2(this)
  }
}

export class Vec2 {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  add(b) {
    return new Vec2(this.x+b.x, this.y+b.y)
  }

  sub(b) {
    return new Vec2(this.x-b.x, this.y-b.y)
  }

  static add(a, b) {
    return new Vec2(a.x+b.x, a.y+b.y)
  }

  static sub(a, b) {
    return new Vec2(a.x-b.x, a.y-b.y)
  }
}
