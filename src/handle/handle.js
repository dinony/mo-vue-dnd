export default {
  functional: true,
  render(h, context) {
    return <div class="mo-dndHandle">{context.slots().default}</div>
  }
}
