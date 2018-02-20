import {getEventCoords} from './event'

import {findAncestorByClassName, indexOf, doc} from './dom'

import {binarySearch} from './search'

// EmptyTraceResult
export class EmptyTraceResult {}

// TraceResult
export class TraceResult {
  // tContainer = targetContainer
  // tItem = targetItem
  // .iIdx = targetItemIndex
  constructor(event, tContainer, tItem, iIndex) {
    this.ev = event
    this.tContainer = tContainer
    this.tItem = tItem
    this.iIdx = iIndex
  }
}

const getBB = elem => elem.getBoundingClientRect()
const getCenter = rect => rect.top+rect.height/2

/**
 * For given event: Pointer/Touch/MouseEvent
 * this method finds the most upper container `tCls` by classname.
 * If a container is found, it also tries to locate a child `iCls` by classname.
 */
export default function traceEvent(event, validAreaCls, tCls='dnd-cont', iCls='dnd-it') {
  const coords = getEventCoords(event)
  if(!coords) {
    return new EmptyTraceResult()
  }

  // elementFromPoint works with viewport coords
  const elemAtPoint = doc.elementFromPoint(coords.clientX, coords.clientY)
  const isInsideValidWrapper = findAncestorByClassName(elemAtPoint, validAreaCls)
  if(!isInsideValidWrapper) {
    return new EmptyTraceResult()
  }

  const tContainer = findAncestorByClassName(elemAtPoint, tCls)

  if(!tContainer) {
    return new EmptyTraceResult()
  } else {
    const tItem = findAncestorByClassName(elemAtPoint, iCls)
    if(tItem) {
      return new TraceResult(event, tContainer, tItem, indexOf(tItem, tContainer))
    } else {
      const getterFn = (arr, i) => {
        if(i < arr.length-1) {
          const cRect = getBB(arr[i])
          const nRect = getBB(arr[i+1])
          const cM = getCenter(cRect)
          const cL = cM+(getCenter(nRect)-cM/2)
          console.log(cL)
          return cL
        } else {
          const rect = getBB(tContainer)
          return rect.bottom
        }
      }
      console.log(coords.clientX)
      // Search in viewport coordinates
      const idx = binarySearch(tContainer.children, getterFn, coords.clientX)
      let searchItem = null
      if(idx >= 0 && idx < tContainer.children.length){
        searchItem = tContainer.children[idx]
      }
      return new TraceResult(event, tContainer, searchItem, idx)
    }
  }
}
