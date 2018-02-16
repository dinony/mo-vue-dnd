export default {
  functional: true,
  props: {
    keyVal: {
      required: true
    },
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
    return <div key={context.props.keyVal} class={cls}>{context.slots().default}</div>
  }
}
