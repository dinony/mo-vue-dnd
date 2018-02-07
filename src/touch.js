export class InvalidTouchEventNameException extends Error {
  constructor(message) {
    super(message)
  }
}

const invalidEventNameErrMsg = key =>
  (`
   Event name: \`${key}\` is not recognized as a touch event.
   Please use a valid event name ('mousedown'|'mousemove'|'mouseup').
  `)

function checkTouchEventName(event) {
  if(event === 'mousedown' || event === 'mousemove' || event === 'mouseup') {
    return
  } else {
    throw new InvalidTouchEventNameException(invalidEventNameErrMsg(event))
  }
}

// Reference:
// https://github.com/bevacqua/dragula/blob/master/dragula.js#L495
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

export default function attachTouchy(obj, event, fn) {
  checkTouchEventName(event)

  if (global.navigator.pointerEnabled) {
    obj[pointers[event]] = fn
  } else if (global.navigator.msPointerEnabled) {
    obj[microsoft[event]] = fn
  } else {
    obj[touch[event]] = fn
    obj[event] = fn
  }
}
