import bus from '../bus'
import {
  DND_TARGET_SELECT,
  DND_TARGET_SELECTED,
  DND_TARGET_UNSELECT,
  DND_TARGET_UNSELECTED,
  DND_ITEM_SELECT,
  DND_ITEM_SELECTED,
  DND_ITEM_UNSELECTED
} from '../events'
import {Vec2, CSSPos} from '../vec'
import {getTouchy} from '../touch'
import {getEventCoords} from '../dom'

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
      target: null,
      selection: null,
      selectedItemPos: null,
      selectedClientRect: null,
      mdPos: null,
      mmPos: null
    }
  },
  mounted() {
    bus.$on(DND_TARGET_SELECT, this.setTarget)
    bus.$on(DND_TARGET_UNSELECT, this.resetTarget)
    bus.$on(DND_ITEM_SELECT, this.setSelectedItem)

    const mm = getTouchy('mousemove')
    mm.forEach(ev => {
      document.addEventListener(ev, this.onMousemove)
    })

    const mu = getTouchy('mouseup')
    mu.forEach(ev => {
      document.addEventListener(ev, this.setInitState)
    })
  },
  beforeDestroy() {
    bus.$off(DND_TARGET_SELECT, this.setTarget)
    bus.$off(DND_TARGET_UNSELECT, this.resetTarget)
    bus.$off(DND_ITEM_SELECT, this.setSelectedItem)

    const mm = getTouchy('mousemove')
    mm.forEach(ev => {
      document.removeEventListener(ev, this.onMousemove)
    })

    const mu = getTouchy('mouseup')
    mu.forEach(ev => {
      document.removeEventListener(ev, this.setInitState)
    })
  },
  computed: {
    mdItemOffset() {
      // Vector pointing from mdPos to (left, top) of selected DnDItem
      // Needed for positioning of drag item
      return this.mdPos && this.selectedItemPos ? this.selectedItemPos.sub(this.mdPos) : null
    },
    dragItemPos() {
      // Return {x,y} in page coordinates
      return this.mmPos && this.mdItemOffset ? this.mmPos.add(this.mdItemOffset) : null
    },
    dragItemDim() {
      return {
        width: `${this.selectedClientRect.width}px`,
        height: `${this.selectedClientRect.height}px`
      }
    },
    dragItemStyle() {
      // Return css positions (page coords) and dimensions {top, left, width, height} of dragged item
      const cssPos = this.dragItemPos ? CSSPos.fromVec2(this.dragItemPos) : null
      return {
        width: this.dragItemDim.width,
        height: this.dragItemDim.height,
        top: cssPos ? cssPos.top: undefined,
        left: cssPos ? cssPos.left: undefined
      }
    }
  },
  methods: {
    setTarget(payload) {
      this.target = payload.targetComponentContext
      bus.$emit(DND_TARGET_SELECTED, payload)
    },
    resetTarget() {
      this.target = null
      bus.$emit(DND_TARGET_UNSELECTED)
    },
    setSelectedItem(payload) {
      this.state = StateEnum.DRAG
      this.selection = payload.itemContext
      const clientRect = payload.elem.getBoundingClientRect()
      this.selectedClientRect = clientRect
      // Selected item page coords
      this.selectedItemPos = Vec2.add(
        new Vec2(window.pageXOffset, window.pageYOffset),
        new Vec2(clientRect.left, clientRect.top))
      // Page coords
      const coords = getEventCoords(payload.event)
      this.mdPos = new Vec2(coords.pageX, coords.pageY)
      bus.$emit(DND_ITEM_SELECTED, payload)
    },
    onMousemove(event) {
      if(!this.selection) {return}
      if(this.mmPos === null) {
        this.mmPos = new Vec2(0, 0)
      }
      const coords = getEventCoords(event)
      if(coords) {
        this.$set(this.mmPos, 'x', coords.pageX)
        this.$set(this.mmPos, 'y', coords.pageY)
      }
    },
    setInitState() {
      this.state = StateEnum.INIT
      this.target = null
      this.selection = null
      this.selectedItemPos = null
      this.selectedClientRect = null
      this.mdPos = null
      this.mmPos = null
      bus.$emit(DND_TARGET_UNSELECTED)
      bus.$emit(DND_ITEM_UNSELECTED)
    }
  },
  render() {
    const debugOut = () => (
      <div class="mo-dndContextDebug">
        <h4>mo-vue-dnd</h4>
        <pre>State: {this.state}</pre>
        <pre>mm: {this.mmPos ? JSON.stringify(this.mmPos, null, 2): null}</pre>
      </div>)

    const content = this.debug ? [this.$slots.default, debugOut()] : this.$slots.default

    if(this.state === StateEnum.DRAG && this.dragItemPos) {
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
