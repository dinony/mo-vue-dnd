export const DND_ITEM_SELECT = 'IS'
export class DnDItemSelectPayload {
  constructor(event, elem, context) {
    this.event = event
    this.elem = elem
    this.context = context
  }
}

export const DND_ITEM_SELECTED = 'ISD'

export const DND_ITEM_UNSELECTED = 'IUD'

export const DND_HANDLE_MD = 'MD'
export class DnDHandleMdPayload {
  constructor(event, container) {
    this.event = event
    this.container = container
  }
}
