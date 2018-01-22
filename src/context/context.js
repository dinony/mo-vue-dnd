import './context.scss'
import bus from '../bus'
import {
  DND_ITEM_SELECTED,
  DND_ITEM_UNSELECTED
} from '../events'
import {add, sub, vec2css} from '../vec'

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
      srcItemPos: null,
      mdPos: null,
      mmPos: null
    }
  },
  mounted() {
    bus.$on(DND_ITEM_SELECTED, this.setSelectedState)
    bus.$on(DND_ITEM_UNSELECTED, this.setInitState)
    document.addEventListener('mousemove', this.onDnDItemMousemove)
    document.addEventListener('mouseup', this.setInitState)
  },
  beforeDestroy() {
    bus.$off(DND_ITEM_SELECTED, this.setSelectedState)
    bus.$off(DND_ITEM_UNSELECTED, this.setInitState)
    document.removeEventListener('mousemove', this.onDnDItemMousemove)
    document.removeEventListener('mouseup', this.setInitState)
  },
  computed: {
    mdItemOffset() {
      // Vector pointing from mdPos to (left, top) of selected DnDItem
      // Needed for positioning of drag item
      return this.mdPos && this.srcItemPos ? sub(this.srcItemPos, this.mdPos) : null
    },
    dragItemPos() {
      // Return {x,y} in viewport coordinates
      return this.mmPos && this.mdItemOffset ? add(this.mmPos, this.mdItemOffset) : null
    },
    dragItemStyle() {
      // Return css positions {top, left} of dragged item
      return this.dragItemPos ? vec2css(this.dragItemPos) : null
    }
  },
  methods: {
    setSelectedState(payload) {
      this.state = StateEnum.DRAG
      this.selection = payload.model
      // Source item viewport coords
      this.srcItemPos = {
        x: payload.clientRect.left,
        y: payload.clientRect.top
      }
      // MouseEvent viewport coords
      this.mdPos = {
        x: payload.event.clientX,
        y: payload.event.clientY
      }
    },
    setInitState() {
      this.state = StateEnum.INIT
      this.selection = null
    },
    onDnDItemMousemove(event) {
      this.mmPos = {
        x: event.clientX,
        y: event.clientY
      }
    }
  },
  render() {
    const debugOut = () => (
      <div class="mo-dndContextDebug">
        <h4>mo-vue-dnd</h4>
        <pre>State: {this.state}</pre>
        <pre>{this.selection ? JSON.stringify(this.dragItemPos, null, 2): null}</pre>
      </div>)

    const content = this.debug ? [this.$slots.default, debugOut()] : this.$slots.default

    if(this.state === StateEnum.DRAG) {
      const dndItemSlot = this.$scopedSlots.default
      const slotArg = {
        item: this.selection.item,
        index: this.selection.index
      }
      return (
        <div class="mo-dndContext mo-dndContextDrag">
          {content}
          <div class="mo-dndDragItem" style={this.dragItemStyle}>
            {dndItemSlot(slotArg)}
          </div>
        </div>)
    } else {
      return <div class="mo-dndContext">{content}</div>
    }
  }
}
