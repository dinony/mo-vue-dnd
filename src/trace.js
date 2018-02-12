import {getEventCoords} from './event'

import {findAncestorByClassName, indexOf, doc} from './dom'

// EmptyTraceResult
export class EmptyTraceResult {}

// TraceResult
export class TraceResult {
  // tContainer = targetContainer
  // tItem = targetItem
  // iIndex = targetItemIndex
  constructor(event, tContainer, tItem, iIndex) {
    this.ev = event
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
export default function traceEvent(event, mdCls='mo-dndHandle', tCls='mo-dndContainer', iCls='mo-dndItem') {
  const coords = getEventCoords(event)
  if(!coords) {
    return new EmptyTraceResult()
  }

  const elemAtPoint = doc.elementFromPoint(coords.pageX, coords.pageY)
  const isInsideMdWrapper = findAncestorByClassName(elemAtPoint, mdCls)
  if(!isInsideMdWrapper) {
    return new EmptyTraceResult()
  }

  const tContainer = findAncestorByClassName(elemAtPoint, tCls)

  if(!tContainer) {
    return new EmptyTraceResult()
  } else {
    const tItem = findAncestorByClassName(elemAtPoint, iCls)

    return tItem ?
      new TraceResult(event, tContainer, tItem, indexOf(tItem, tContainer)):
      new TraceResult(event, tContainer, null, null)
  }
}
