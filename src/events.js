export const DND_ITEM_SELECT = 'MO_DND_ITEM_SELECT'
export class DnDItemSelectPayload {
  constructor(event, clientRect, context) {
    this.event = event
    this.clientRect = clientRect
    this.context = context
  }
}

export const DND_ITEM_SELECTED = 'MO_DND_ITEM_SELECTED'

export const DND_ITEM_UNSELECTED = 'MO_DND_ITEM_UNSELECTED'
