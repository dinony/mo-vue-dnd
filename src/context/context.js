import bus from '../bus'
import {Vec2, CSSPos} from '../vec'
import {getTouchy} from '../touch'
import {getEventCoords} from '../event'
import {
  DND_ITEM_TRACED, ItemTracedPl,
  DND_ITEM_SELECT, DND_ITEM_SELECTED
} from '../events'
import {doc} from '../dom'
import {default as trace, EmptyTraceResult} from '../trace'

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
      tRes: null, // traceResult
      selIt: null, // selected item
      selItPos: null, // selected item position
      selItRect: null, // selected item clientRect
      mdPos: null,
      mmPos: null,
      // target: null
    }
  },
  beforeMount() {
    doc.addEventListener(getTouchy('mousedown'), this.onMousedown)
    bus.$on(DND_ITEM_SELECT, this.onItemSelect)
    // bus.$on(DND_ITEM_SELECT, this.setSelectedItem)
    // bus.$on(DND_REQUEST_ITEM, this.sendRequestedItem)
    // bus.$on(DND_TARGET_SELECT, this.setTarget)
    // bus.$on(DND_TARGET_UNSELECT, this.resetTarget)
    // bus.$on(DND_REQUEST_TARGET, this.sendRequestedTarget)

    // doc.addEventListener(getTouchy('mousemove'), this.onMousemove)
    // doc.addEventListener(getTouchy('mouseup'), this.setInitState)
  },
  beforeDestroy() {
    doc.removeEventListener(getTouchy('mousedown'), this.onMousedown)
    bus.$off(DND_ITEM_SELECT, this.onItemSelect)

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
      return this.mdPos && this.selItPos ? this.selItPos.sub(this.mdPos) : null
    },
    dragItemPos() {
      // Return {x,y} in page coordinates
      return this.mmPos && this.mdItemOffset ? this.mmPos.add(this.mdItemOffset) : null
    },
    dragItemDim() {
      return {
        width: `${this.selItRect.width}px`,
        height: `${this.selItRect.height}px`
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
    setInitState() {
      this.state = StateEnum.INIT
      // this.target = null
      // this.selectionPayload = null
      this.selIt = null
      this.selItPos = null
      this.selItRect = null
      this.mdPos = null
      this.mmPos = null
    },
    onMousedown(event) {
      const res = trace(event)
      if(res instanceof EmptyTraceResult) {return}
      if(res.tContainer && res.tItem) {
        this.tRes = res
        bus.$emit(DND_ITEM_TRACED, new ItemTracedPl(event, res))
      }
    },
    onItemSelect(itemCtx) {
      this.state = StateEnum.DRAG
      this.selIt = itemCtx

      const itRect = this.tRes.tItem.getBoundingClientRect()
      this.selItRect = itRect

      // Selected item page coords
      this.selItPos = Vec2.add(
        new Vec2(window.pageXOffset, window.pageYOffset),
        new Vec2(itRect.left, itRect.top))

      const coords = getEventCoords(event)
      this.mdPos = new Vec2(coords.pageX, coords.pageY)

      bus.$emit(DND_ITEM_SELECTED, this.selIt)
    },
    onMousemove(event) {
      const coords = getEventCoords(event)
      if(coords) {
        if(!this.mmPos) {this.mmPos= new Vec2(0,0)}
        this.$set(this.mmPos, 'x', coords.pageX)
        this.$set(this.mmPos, 'y', coords.pageY)
      }
    },
    onMouseup(event) {
      this.setInitState()
    },
    // setSelectedItem(payload) {
    //   this.state = StateEnum.DRAG
    //   this.selectionPayload = payload
    //   const clientRect = payload.elem.getBoundingClientRect()
    //   this.selItRect = clientRect
    //   // Selected item page coords
    //   this.selItPos = Vec2.add(
    //     new Vec2(window.pageXOffset, window.pageYOffset),
    //     new Vec2(clientRect.left, clientRect.top))
    //   // Page coords
    //   const coords = getEventCoords(payload.event)
    //   this.mdPos = new Vec2(coords.pageX, coords.pageY)
    //   bus.$emit(DND_ITEM_SELECTED, payload)
    // },
    // sendRequestedItem() {
    //   bus.$emit(DND_REQUESTED_ITEM, this.selectionPayload)
    // },
    // // onMousemove(event) {
    // //   if(!this.selectionPayload) {return}
    // //   if(this.mmPos === null) {
    // //     this.mmPos = new Vec2(0, 0)
    // //   }
    // //   const coords = getEventCoords(event)
    // //   if(coords) {
    // //     this.$set(this.mmPos, 'x', coords.pageX)
    // //     this.$set(this.mmPos, 'y', coords.pageY)
    // //   }
    // // },
    // setTarget(payload) {
    //   this.target = payload
    //   bus.$emit(DND_TARGET_SELECTED, payload)
    // },
    // resetTarget() {
    //   this.target = null
    //   bus.$emit(DND_TARGET_UNSELECTED)
    // },
    // sendRequestedTarget() {
    //   bus.$emit(DND_REQUESTED_TARGET, this.target)
    // }
  },
  watch: {
    selIt(newItem, oldItem) {
      // Only attach mm/mu when there is a selected item
      if(!oldItem && newItem !== null) {
        doc.addEventListener(getTouchy('mousemove'), this.onMousemove)
        doc.addEventListener(getTouchy('mouseup'), this.onMouseup)
      } else if(oldItem && !newItem) {
        doc.removeEventListener(getTouchy('mousemove'), this.onMousemove)
        doc.removeEventListener(getTouchy('mouseup'), this.onMouseup)
      }
    }
  },
  render() {
    const debugOut = () => (
      <div class="mo-dndContextDebug">
        <h4>mo-vue-dnd</h4>
        <pre>State: {this.state}</pre>
        <pre>Selected: {this.selIt ? JSON.stringify(this.selIt.item, null, 2): null}</pre>
        <pre>mm: {this.mmPos ? JSON.stringify(this.mmPos, null, 2): null}</pre>
      </div>)

    const content = this.debug ? [this.$slots.default, debugOut()] : this.$slots.default

    if(this.state === StateEnum.DRAG && this.dragItemPos) {
      const dndItemSlot = this.$scopedSlots.default
      const slotArg = {
        item: this.selIt.item,
        index: this.selIt.index
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
