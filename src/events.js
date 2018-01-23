export const DND_ITEM_SELECT = 'MO_DND_ITEM_SELECT'

export const DND_ITEM_SELECTED = 'MO_DND_ITEM_SELECTED'
export const DND_ITEM_UNSELECTED = 'MO_DND_ITEM_UNSELECTED'

export const DND_ITEM_DROP = 'MO_DND_ITEM_DROP'

export class DnDItemSelectPayload {
  constructor(event, clientRect, context) {
    this.event = event
    this.clientRect = clientRect
    this.context = context
  }
}
