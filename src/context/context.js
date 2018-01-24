import './context.scss'
import bus from '../bus'
import {
  DND_ITEM_SELECT,
  DND_ITEM_SELECTED,
  DND_ITEM_UNSELECTED,
  DND_ITEM_DROP
} from '../events'
import {Vec2, CSSPos} from '../vec'

const StateEnum = {
  INIT: 0,
  DRAG: 1
}

export class DragContext {
  constructor(container, index) {
    this.container = container
    this.index = index
  }

  get item() {
    return this.container[this.index]
  }
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
      selectedItemPos: null,
      mdPos: null,
      mmPos: null
    }
  },
  mounted() {
    bus.$on(DND_ITEM_SELECT, this.setSelectedState)
    bus.$on(DND_ITEM_DROP, this.onItemDrop)
    document.addEventListener('mousemove', this.onMousemove)
    document.addEventListener('mouseup', this.setInitState)
  },
  beforeDestroy() {
    bus.$off(DND_ITEM_SELECT, this.setSelectedState)
    bus.$off(DND_ITEM_DROP, this.onItemDrop)
    document.removeEventListener('mousemove', this.onMousemove)
    document.removeEventListener('mouseup', this.setInitState)
  },
  computed: {
    mdItemOffset() {
      // Vector pointing from mdPos to (left, top) of selected DnDItem
      // Needed for positioning of drag item
      return this.mdPos && this.selectedItemPos ? this.selectedItemPos.sub(this.mdPos) : null
    },
    dragItemPos() {
      // Return {x,y} in viewport coordinates
      return this.mmPos && this.mdItemOffset ? this.mmPos.add(this.mdItemOffset) : null
    },
    dragItemStyle() {
      // Return css positions {top, left} of dragged item
      return this.dragItemPos ? CSSPos.fromVec2(this.dragItemPos) : null
    }
  },
  methods: {
    setSelectedState(payload) {
      this.state = StateEnum.DRAG
      this.selection = payload.context
      // Selected item viewport coords
      this.selectedItemPos = CSSPos.toVec2(payload.clientRect)
      // MouseEvent viewport coords
      this.mdPos = new Vec2(payload.event.clientX, payload.event.clientY)
      bus.$emit(DND_ITEM_SELECTED, this.selection)
    },
    setInitState() {
      this.state = StateEnum.INIT
      this.selection = null
      this.selectedItemPos = null
      this.mdPos = null
      this.mmPos = null
      bus.$emit(DND_ITEM_UNSELECTED)
    },
    onMousemove(event) {
      if(this.mmPos === null) {
        this.mmPos = new Vec2(0, 0)
      }
      this.$set(this.mmPos, 'x', event.clientX)
      this.$set(this.mmPos, 'y', event.clientY)
    },
    onItemDrop(dragState) {
      console.log('handleDrop', dragState)
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
