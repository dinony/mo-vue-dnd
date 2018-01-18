import './context.scss'
import bus from '../bus'
import {
  DND_ITEM_SELECTED,
  DND_ITEM_UNSELECTED
} from '../events'

const StateEnum = {
  INIT: 0,
  DRAG: 1
}

export default {
  props: {
    debug: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      state: StateEnum.INIT,
      selection: null,
      mousePos: null
    }
  },
  mounted() {
    bus.$on(DND_ITEM_SELECTED, this.setSelectedState)
    bus.$on(DND_ITEM_UNSELECTED, this.setInitState)
  },
  beforeDestroy() {
    bus.$off(DND_ITEM_SELECTED, this.setSelectedState)
    bus.$off(DND_ITEM_UNSELECTED, this.setInitState)
  },
  methods: {
    setSelectedState({event, payload, clientRect}) {
      this.state = StateEnum.DRAG
      this.selection = payload
      this.mousePos = {
        x: clientRect.left,
        y: clientRect.top
      }
    },
    setInitState() {
      this.state = StateEnum.INIT
      this.selection = null
    },
    onDnDItemMousemove: function(event) {
      console.log('mousemove')
      this.mousePos = {
        y: event.pageY,
        x: event.pageX
      }
    }
  },
  render() {
    const debugOut = () => {
      return (
        <div class="mo-dndContextDebug">
          <h4>mo-vue-dnd</h4>
          <pre>State: {this.state}</pre>
          <pre>{this.selection ? JSON.stringify(this.selection.item, null, 2): null}</pre>
        </div>)
    }

    const content = this.debug ? [this.$slots.default, debugOut()] : this.$slots.default

    if(this.state === StateEnum.DRAG) {
      const dndItemStyle = {
        top: this.mousePos.y+'px',
        left: this.mousePos.x+'px'
      }
      const dndItemSlot = this.$scopedSlots.default
      return (
        <div class="mo-dndContext mo-dndContextDrag" onMouseup={this.setInitState} onMousemove={this.onDnDItemMousemove}>
          {content}
          <div class="mo-dndDragItem" style={dndItemStyle}>
            {dndItemSlot({item: this.selection.item, index: this.selection.index})}
          </div>
        </div>)
    } else {
      return <div class="mo-dndContext">{content}</div>
    }
  }
}
