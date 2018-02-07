import bus from '../bus'
import {default as attachTouchy, isTouch} from '../touch'
import {DND_HANDLE_MD, HandleMdPayload} from '../events'

function onMousedown(event, componentContext) {
  if(isTouch(event)) {
    if(event.touches.length !== 1) {return}
  } else {
    // Just left button clicks
    if(event.button !== 0) {return}
  }

  event.stopPropagation()
  bus.$emit(DND_HANDLE_MD, new HandleMdPayload(event, componentContext))
}

export default {
  functional: true,
  render(h, context) {
    const listeners = {on:{}}

    attachTouchy(listeners.on, 'mousedown', ev => onMousedown(ev, context.props.componentContext))

    return (
      <div class="mo-dndHandle" {...listeners}>
        {context.slots().default}
      </div>)
  }
}
