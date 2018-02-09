import {getEventCoords} from './event'

import {findAncestorByClassName, indexOf} from './dom'

// EmptyTraceResult
export class EmptyTraceRes {}

// TraceResult
export class TraceRes {
  // tContainer = targetContainer
  // tItem = targetItem
  // iIndex = targetItemIndex
  constructor(tContainer, tItem, iIndex) {
    this.tContainer = tContainer
    this.tItem = tItem
    this.iIndex = iIndex
  }
}

/**
 * For given event: Pointer/Touch/MouseEvent
 * this method finds the most upper container `tCls` by classname.
 * If a container is found, it also tries to locate a child `iCls` by classname.
 */
export default function traceEvent(event, tCls='mo-dndContainer', iCls='mo-dndItem') {
  const coords = getEventCoords(event)
  if(!coords) {
    return new EmptyTraceRes()
  }

  const elemAtPoint = document.elementFromPoint(coords.pageX, coords.pageY)
  const tContainer = findAncestorByClassName(elemAtPoint, tCls)

  if(!tContainer) {
    return new EmptyTraceRes()
  } else {
    const tItem = findAncestorByClassName(elemAtPoint, iCls)

    return tItem ?
      new TraceRes(tContainer, tItem, indexOf(tContainer, tItem)):
      new TraceRes(tContainer, null, null)
  }
}
