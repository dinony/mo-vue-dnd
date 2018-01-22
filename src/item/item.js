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

function onMouseenter(event, model) {
  console.log('mouseenter', event)
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
    const params = {
      class: {'mo-dndItemSelected': props.isSelected}
    }
    return (
      <div class="mo-dndItem" {...params}
        onMousedown={ev => onMousedown(ev, model)}
        onMouseenter={ev => onMouseenter(ev, model)}>
        {slots.default}
      </div>)
  }
}
