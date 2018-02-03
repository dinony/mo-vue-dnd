export const DND_ITEM_SELECT = 'IS'
export class ItemSelectPayload {
  constructor(event, elem, context) {
    this.event = event
    this.elem = elem
    this.context = context
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

export const DND_TARGET_ENTER = 'TE'

export class TargetEnterPayload {
  constructor(targetRef) {
    this.targetRef = targetRef
  }
}

export const DND_TARGET_ENTERED = 'TED'
