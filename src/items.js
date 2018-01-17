export default {
  functional: true,
  render(h, context) {
    const props = context.props
    const dndItemSlot = context.data.scopedSlots.default
    return (
      <div>
      {props.items.map(i => dndItemSlot(i))}
      </div>
    )
  }
}
