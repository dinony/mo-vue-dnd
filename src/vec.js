export function add(p1, p2) {
  return {x: p1.x+p2.x, y: p1.y+p2.y}
}

export function sub(p1, p2) {
  return {x: p1.x-p2.x, y: p1.y-p2.y}
}

export function vec2css(p) {
  return {left: `${p.x}px`, top: `${p.y}px`}
}
