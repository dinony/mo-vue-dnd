import bus from './bus'
import {
  DND_ITEM_SELECTED,
  DND_ITEM_UNSELECTED
} from './events'

function onMousedown(ev, payload) {
  const clientRect = ev.target.getBoundingClientRect()
  bus.$emit(DND_ITEM_SELECTED, {event: ev, payload, clientRect})
}

function onMouseup(ev, payload) {
  bus.$emit(DND_ITEM_UNSELECTED, {event: ev, payload})
}

export default {
  functional: true,
  render(h, context) {
    const props = context.props
    const payload = {
      source: props.source,
      item: props.item,
      index: props.index
    }
    const slots = context.slots()
    return (
      <div class="mo-dndItem"
        onMousedown={ev => onMousedown(ev, payload)}
        onMouseup={ev => onMouseup(ev, payload)}>
        {slots.default}
      </div>
    )
  }
}
