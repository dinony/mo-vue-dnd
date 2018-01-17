import DnDItem from './item'

export default {
  functional: true,
  render(h, context) {
    const props = context.props
    const dndItemSlot = context.data.scopedSlots.default

    const content = props.items.map((item, i) => {
      return (
        <DnDItem source={props.items} item={item} index={i}>
          {dndItemSlot({item, i})}
        </DnDItem>
      )
    })

    return <div class="mo-dndItems">{content}</div>
  }
}
