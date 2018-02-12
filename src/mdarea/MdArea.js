export default {
  functional: true,
  render(h, context) {
    return <div class="dnd-mdarea">{context.slots().default}</div>
  }
}
