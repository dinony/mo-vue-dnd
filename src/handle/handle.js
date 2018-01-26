import bus from '../bus'
import {DND_HANDLE_MD, DnDHandleMdPayload} from '../events'

function onMousedown(event, container) {
  // Just left button clicks
  if(event.button !== 0) {return}
  bus.$emit(DND_HANDLE_MD, new DnDHandleMdPayload(event, container))
}

export default {
  functional: true,
  render(h, context) {
    return (
      <div class="mo-dndHandle" onMousedown={ev => onMousedown(ev, context.props.container)}>
        {context.slots().default}
      </div>)
  }
}
