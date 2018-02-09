import {getEventCoords} from './event'

import {findAncestorByClassName, indexOf} from './dom'

// EmptyTraceResult
export class EmptyTraceResult {}

// TraceResult
export class TraceResult {
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
    return new EmptyTraceResult()
  }

  const elemAtPoint = document.elementFromPoint(coords.pageX, coords.pageY)
  const tContainer = findAncestorByClassName(elemAtPoint, tCls)

  if(!tContainer) {
    return new EmptyTraceResult()
  } else {
    const tItem = findAncestorByClassName(elemAtPoint, iCls)

    return tItem ?
      new TraceResult(tContainer, tItem, indexOf(tItem, tContainer)):
      new TraceResult(tContainer, null, null)
  }
}
