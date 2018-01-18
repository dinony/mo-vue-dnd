import './item.scss'
import bus from '../bus'
import {
  DND_ITEM_SELECTED
} from '../events'

function onMousedown(event, model) {
  if(event.button !== 0) {return}
  const clientRect = event.target.getBoundingClientRect()
  const payload = {event, clientRect, model}
  bus.$emit(DND_ITEM_SELECTED, payload)
}

export default {
  functional: true,
  render(h, context) {
    const props = context.props
    const model = {
      source: props.source,
      item: props.item,
      index: props.index
    }
    const slots = context.slots()
    return (
      <div class="mo-dndItem" onMousedown={ev => onMousedown(ev, model)}>
        {slots.default}
      </div>)
  }
}
