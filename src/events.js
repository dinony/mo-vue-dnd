export const DND_ITEM_SELECT = 'MO_DND_ITEM_SELECT'
export class DnDItemSelectPayload {
  constructor(event, elem, context) {
    this.event = event
    this.elem = elem
    this.context = context
  }
}

export const DND_ITEM_SELECTED = 'MO_DND_ITEM_SELECTED'

export const DND_ITEM_UNSELECTED = 'MO_DND_ITEM_UNSELECTED'

export const DND_HANDLE_MD = 'MO_DND_HANDLE_MD'
export class DnDHandleMdPayload {
  constructor(event, container) {
    this.event = event
    this.container = container
  }
}
