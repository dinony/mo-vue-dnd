import {isTouch} from './touch'

export function getEventCoords(event) {
  if(isTouch(event)) {
    const touch = event.touches[0]
    if(touch) {
      return {
        'pageX': touch.pageX,
        'pageY': touch.pageY
      }
    }
  } else if(event instanceof MouseEvent) {
    return {
      'pageX': event.pageX,
      'pageY': event.pageY
    }
  }
  return null
}
