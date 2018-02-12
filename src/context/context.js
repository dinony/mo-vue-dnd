import bus from '../bus'
import {
  DND_ITEM_SELECT,
  DND_ITEM_SELECTED,
  DND_REQUEST_ITEM,
  DND_REQUESTED_ITEM,
  DND_ITEM_UNSELECTED,
  DND_TARGET_SELECT,
  DND_TARGET_SELECTED,
  DND_REQUEST_TARGET,
  DND_REQUESTED_TARGET,
  DND_TARGET_UNSELECT,
  DND_TARGET_UNSELECTED
} from '../events'
import {Vec2, CSSPos} from '../vec'
import {getTouchy} from '../touch'
import {getEventCoords} from '../event'
import {doc} from '../dom'

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
      selectionPayload: null,
      selectedItemPos: null,
      selectedClientRect: null,
      mdPos: null,
      mmPos: null
    }
  },
  beforeMount() {
    // bus.$on(DND_ITEM_SELECT, this.setSelectedItem)
    // bus.$on(DND_REQUEST_ITEM, this.sendRequestedItem)
    // bus.$on(DND_TARGET_SELECT, this.setTarget)
    // bus.$on(DND_TARGET_UNSELECT, this.resetTarget)
    // bus.$on(DND_REQUEST_TARGET, this.sendRequestedTarget)

    doc.addEventListener(getTouchy('mousedown'), this.onMousedown)
    // doc.addEventListener(getTouchy('mousemove'), this.onMousemove)
    // doc.addEventListener(getTouchy('mouseup'), this.setInitState)
  },
  beforeDestroy() {
    // bus.$off(DND_ITEM_SELECT, this.setSelectedItem)
    // bus.$off(DND_REQUEST_ITEM, this.sendRequestedItem)
    // bus.$off(DND_TARGET_SELECT, this.setTarget)
    // bus.$off(DND_TARGET_UNSELECT, this.resetTarget)
    // bus.$off(DND_REQUEST_TARGET, this.sendRequestedTarget)

    // doc.removeEventListener(getTouchy('mousemove'), this.onMousemove)
    // doc.removeEventListener(getTouchy('mouseup'), this.setInitState)
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
    onMousedown(event) {
      debugger
    },
    setSelectedItem(payload) {
      this.state = StateEnum.DRAG
      this.selectionPayload = payload
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
    sendRequestedItem() {
      console.log('rI')
      bus.$emit(DND_REQUESTED_ITEM, this.selectionPayload)
    },
    onMousemove(event) {
      if(!this.selectionPayload) {return}
      if(this.mmPos === null) {
        this.mmPos = new Vec2(0, 0)
      }
      const coords = getEventCoords(event)
      if(coords) {
        this.$set(this.mmPos, 'x', coords.pageX)
        this.$set(this.mmPos, 'y', coords.pageY)
      }
    },
    setTarget(payload) {
      this.target = payload
      bus.$emit(DND_TARGET_SELECTED, payload)
    },
    resetTarget() {
      this.target = null
      bus.$emit(DND_TARGET_UNSELECTED)
    },
    sendRequestedTarget() {
      console.log('rT')
      bus.$emit(DND_REQUESTED_TARGET, this.target)
    },
    setInitState() {
      this.state = StateEnum.INIT
      this.target = null
      this.selectionPayload = null
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
      const selection = this.selectionPayload.itemContext
      const slotArg = {
        item: selection.item,
        index: selection.index
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
