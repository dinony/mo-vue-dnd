import './item.scss'

export default {
  functional: true,
  render(h, context) {
    const slots = context.slots()
    const params = {
      class: {
        'mo-dndItem': true,
        'mo-dndItemSelected': context.props.isSelected
      }
    }
    return <div {...params}>{slots.default}</div>
  }
}
