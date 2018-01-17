function onMousedown(ev, payload) {
  console.log('mousedown', payload)
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
      <div class="mo-dndItem" onMousedown={ev => onMousedown(ev, payload)}>
        {slots.default}
      </div>
    )
  }
}
