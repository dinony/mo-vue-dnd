export default {
  functional: true,
  props: {
    isSelected: {
      type: Boolean,
      default: false
    },
    isProjected: {
      type: Boolean,
      default: false
    }
  },
  render(h, context) {
    const cls = {
      'mo-dndItem': true,
      'mo-dndItemSelected': context.props.isSelected,
      'mo-dndItemProjected': context.props.isProjected
    }
    return <div class={cls}>{context.slots().default}</div>
  }
}
