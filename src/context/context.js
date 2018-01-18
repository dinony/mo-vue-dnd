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
      itemPos: null,
      dragPos: null,
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
      // vector pointing from mdPos to (left, top) of selected DnDItem
      // Needed for positioning of drag item
      return this.mdPos && this.itemPos ? sub(this.itemPos, this.mdPos) : null
    },
    dragItemStyle() {
      return this.dragPos && this.mdItemOffset ? vec2css(add(this.dragPos, this.mdItemOffset)) : null
    }
  },
  methods: {
    setSelectedState(payload) {
      this.state = StateEnum.DRAG
      this.selection = payload.model
      this.itemPos = {
        x: payload.clientRect.left,
        y: payload.clientRect.top
      }
      this.mdPos = {
        x: payload.event.pageX,
        y: payload.event.pageY
      }
      this.dragPos = this.mdPos
    },
    setInitState() {
      this.state = StateEnum.INIT
      this.selection = null
    },
    onDnDItemMousemove(event) {
      this.dragPos = {y: event.pageY,x: event.pageX}
    }
  },
  render() {
    const debugOut = () => (
      <div class="mo-dndContextDebug">
        <h4>mo-vue-dnd</h4>
        <pre>State: {this.state}</pre>
        <pre>{this.selection ? JSON.stringify(this.selection.item, null, 2): null}</pre>
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
