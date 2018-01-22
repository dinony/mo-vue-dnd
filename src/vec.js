export function add(p1, p2) {
  return {x: p1.x+p2.x, y: p1.y+p2.y}
}

export function sub(p1, p2) {
  return {x: p1.x-p2.x, y: p1.y-p2.y}
}

export function vec2css(p) {
  return {left: `${p.x}px`, top: `${p.y}px`}
}

const cssPx = x => `${x}px`
const parseCSSPx = cssPxStr => {

}

export class CSSPos {
  constructor(left, top) {
    this.left = cssPx(left)
    this.top = cssPx(top)
  }

  static fromVec2(vec2) {
    return new CSSPos(vec2.x, vec2.y)
  }

  toVec2() {
    return new Vec2(parseCSSPx(this.left), parseCSSPx(this.top))
  }
}

export class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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
