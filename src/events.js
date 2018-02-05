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
  constructor(event, container) {
    this.event = event
    this.container = container
  }
}

export const DND_TARGET_SELECT = 'TS'

export class TargetSelectPayload {
  constructor(targetComponent) {
    this.targetComponent = targetComponent
  }
}

export const DND_TARGET_SELECTED = 'TSD'
export const DND_TARGET_UNSELECT = 'TU'
export const DND_TARGET_UNSELECTED = 'TUD'

