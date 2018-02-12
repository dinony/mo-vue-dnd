export class InvalidTouchEventNameException extends Error {
  constructor(message) {
    super(message)
  }
}

const invalidEventNameErrMsg = key =>
  (`
   Event name: \`${key}\` cannot be mapped to an according touch or pointer event.
   Please use a valid event name ('mousedown'|'mousemove'|'mouseup').
  `)

function checkTouchEventName(event) {
  if(event === 'mousedown' || event === 'mousemove' || event === 'mouseup') {
    return
  } else {
    throw new InvalidTouchEventNameException(invalidEventNameErrMsg(event))
  }
}

const touch = {
  mousedown: 'touchstart',
  mousemove: 'touchmove',
  mouseup: 'touchend'
}

const pointers = {
  mousedown: 'pointerdown',
  mousemove: 'pointermove',
  mouseup: 'pointerup'
}

const microsoft = {
  mousedown: 'MSPointerDown',
  mousemove: 'MSPointerMove',
  mouseup: 'MSPointerUp'
}

// Note: http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
export const SUPPORTS_TOUCH = 'ontouchstart' in document.documentElement
const nav = global.navigator
// Reference:
// https://github.com/bevacqua/dragula/blob/master/dragula.js#L495
export default function attachTouchy(obj, event, fn) {
  checkTouchEventName(event)

  if (nav.pointerEnabled) {
    obj[pointers[event]] = fn
  } else if (nav.msPointerEnabled) {
    obj[microsoft[event]] = fn
  } else if(SUPPORTS_TOUCH) {
    obj[touch[event]] = fn
  } else {
    obj[event] = fn
  }
}

export function getTouchy(event) {
  checkTouchEventName(event)

  if (nav.pointerEnabled) {
    return pointers[event]
  } else if (nav.msPointerEnabled) {
    return microsoft[event]
  } else if (SUPPORTS_TOUCH) {
    return touch[event]
  } else {
    return event
  }
}

export function isTouch(event) {
  if(event instanceof MouseEvent) {
    return false
  } else {
    // Note: cannot use `event instanceof TouchEvent`
    // since TouchEvent is undefined in IE11
    return event.touches? true: false
  }
}
