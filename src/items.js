export default {
  functional: true,
  render(h, context) {
    const props = context.props
    const scopedSlot = context.data.scopedSlots.default
    return (
      <div>
        {props.items.map(i => scopedSlot(i))}
      </div>
    )
  }
}
