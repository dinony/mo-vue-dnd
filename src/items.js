export default {
  functional: true,
  render(h, {props: {items}}) {
    return (
      <div>
        {items.map(i => <div>{i}</div>)}
      </div>
    )
  }
}
