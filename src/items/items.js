import DnDItem from '../item/item'

export default {
  functional: true,
  render(h, context) {
    const props = context.props
    const dndItemSlot = context.data.scopedSlots.default

    const content = props.items.map((item, index) => (
      <DnDItem source={props.items} item={item} index={index} isSelected={index === 2}>
        {dndItemSlot({item, index})}
      </DnDItem>))

    return <div class="mo-dndItems">{content}</div>
  }
}
