export const DND_ITEM_SELECT = 'IS'
export class ItemSelectPayload {
  constructor(event, elem, itemContext) {
    this.event = event
    this.elem = elem
    this.itemContext = itemContext
  }
}

export const DND_ITEM_SELECTED = 'ISD'

export const DND_ITEM_UNSELECTED = 'IUD'

export const DND_HANDLE_MD = 'MD'
export class HandleMdPayload {
  constructor(event, targetComponentContext) {
    this.event = event
    this.targetComponentContext = targetComponentContext
  }
}

export const DND_REQUEST_ITEM = 'RI'
export const DND_REQUESTED_ITEM = 'RID'

export const DND_REQUEST_TARGET = 'RT'
export const DND_REQUESTED_TARGET = 'RTD'

export const DND_TARGET_SELECT = 'TS'

export class TargetSelectPayload {
  constructor(targetElement) {
    this.targetElement = targetElement
  }
}

export const DND_TARGET_SELECTED = 'TSD'
export const DND_TARGET_UNSELECT = 'TU'
export const DND_TARGET_UNSELECTED = 'TUD'

export const DND_TARGET_ITEM_CONTEXT = 'TIC'

export class TargetItemContextPayload {
  constructor(event, targetElem, itemElem, itemIndex) {
    this.event = event
    this.targetElem = targetElem
    this.itemElem = itemElem
    this.itemIndex = itemIndex
  }
}
