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
      'dnd-it': true,
      'dnd-it-sel': context.props.isSelected,
      'dnd-it-proj': context.props.isProjected
    }
    return <div class={cls}>{context.slots().default}</div>
  }
}
