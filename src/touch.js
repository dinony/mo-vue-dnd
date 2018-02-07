const touch = {
  mouseup: 'touchend',
  mousedown: 'touchstart',
  mousemove: 'touchmove'
}

const pointers = {
  mouseup: 'pointerup',
  mousedown: 'pointerdown',
  mousemove: 'pointermove'
}

const microsoft = {
  mouseup: 'MSPointerUp',
  mousedown: 'MSPointerDown',
  mousemove: 'MSPointerMove'
}

// Reference:
// https://github.com/bevacqua/dragula/blob/master/dragula.js#L495
export default function attachTouchy(obj, event, fn) {
  if (global.navigator.pointerEnabled) {
    obj[pointers[event]] = fn
  } else if (global.navigator.msPointerEnabled) {
    obj[microsoft[event]] = fn
  } else {
    obj[touch[event]] = fn
    obj[event] = fn
  }
}
