import bus from '../bus'
import {DND_HANDLE_MD, HandleMdPayload} from '../events'

function onMousedown(event, componentContext) {
  // Just left button clicks
  if(event.button !== 0) {return}
  event.stopPropagation()
  bus.$emit(DND_HANDLE_MD, new HandleMdPayload(event, componentContext))
}

export default {
  functional: true,
  render(h, context) {
    return (
      <div class="mo-dndHandle" onMousedown={ev => onMousedown(ev, context.props.componentContext)}>
        {context.slots().default}
      </div>)
  }
}
