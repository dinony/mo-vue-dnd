import bus from '../bus'
import {Vec2, CSSPos} from '../vec'
import {getTouchy} from '../touch'
import {getEventCoords} from '../event'
import {
  DND_ITEM_TRACED,
  DND_ITEM_SELECT, DND_ITEM_SELECTED,
  DND_ITEM_UNSELECTED,
  DND_TARGET_SELECTED, DND_TARGET_UNSELECTED,
  DND_MOVE_TRACE,
  DND_DROP
} from '../events'
import {doc, isDescendant} from '../dom'
import {
  default as trace,
  EmptyTraceResult,
  TraceResult
} from '../trace'

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
      curTrg: null // current target
    }
  },
  beforeMount() {
    doc.addEventListener(getTouchy('mousedown'), this.onMousedown)
    bus.$on(DND_ITEM_SELECT, this.onItemSelect)
  },
  beforeDestroy() {
    doc.removeEventListener(getTouchy('mousedown'), this.onMousedown)
    bus.$off(DND_ITEM_SELECT, this.onItemSelect)
  },
  computed: {
    mdItemOffset() {
      // Vector pointing from mdPos to (left, top) of selected DnDItem
      // Needed for positioning of drag item
      return this.mdPos && this.selItPos ? this.selItPos.sub(this.mdPos): null
    },
    dragItemPos() {
      // Return {x,y} in page coordinates
      return this.mmPos && this.mdItemOffset ? this.mmPos.add(this.mdItemOffset): null
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
      this.selIt = null
      this.selItPos = null
      this.selItRect = null
      this.curTrg = null
      this.mdPos = null
      this.mmPos = null
    },
    onMousedown(event) {
      const traceRes = trace(event, 'dnd-mdarea')
      if(traceRes instanceof EmptyTraceResult) {return}
      if(traceRes.tContainer && traceRes.tItem &&
        isDescendant(traceRes.tContainer, traceRes.tItem)) {
        this.tRes = traceRes
        bus.$emit(DND_ITEM_TRACED, traceRes)
      }
    },
    onItemSelect(itemCtx) {
      // Handle state
      this.state = StateEnum.DRAG

      // Handle selected item
      this.selIt = itemCtx

      const itRect = this.tRes.tItem.getBoundingClientRect()
      this.selItRect = itRect

      // Selected item page coords
      this.selItPos = Vec2.add(
        new Vec2(window.pageXOffset, window.pageYOffset),
        new Vec2(itRect.left, itRect.top))

      // Handle mouse down position
      const coords = getEventCoords(this.tRes.ev)
      this.mdPos = new Vec2(coords.pageX, coords.pageY)
      this.mmPos = new Vec2(coords.pageX, coords.pageY)

      // Handle current target
      this.curTrg = this.tRes.tContainer

      // Notify
      bus.$emit(DND_TARGET_SELECTED, this.curTrg)
      bus.$emit(DND_ITEM_SELECTED, this.selIt)
    },
    onMousemove(event) {
      event.preventDefault()
      // Handle target
      const traceRes = trace(event, 'dnd-cont')
      if(traceRes instanceof TraceResult) {
        // Check for self drop in potential inner dnd container
        if(!isDescendant(this.tRes.tItem, traceRes.tContainer)) {
          if(this.curTrg !== traceRes.tContainer) {
            bus.$emit(DND_TARGET_SELECTED, traceRes.tContainer)
          }
          this.curTrg = traceRes.tContainer

          if(traceRes.tItem) {
            // Target and item are known -> emit move trace
            bus.$emit(DND_MOVE_TRACE, traceRes)
          }
        }
      } else {
        if(this.curTrg) {
          bus.$emit(DND_TARGET_UNSELECTED)
        }
        this.curTrg = null
      }

      // Update current mouse position
      const coords = getEventCoords(event)
      if(coords) {
        this.$set(this.mmPos, 'x', coords.pageX)
        this.$set(this.mmPos, 'y', coords.pageY)
      }
    },
    onMouseup() {
      if(this.selIt) {
        bus.$emit(DND_DROP)

        this.setInitState()
        bus.$emit(DND_ITEM_UNSELECTED)
        bus.$emit(DND_TARGET_UNSELECTED)
      }
    }
  },
  watch: {
    selIt(newItem, oldItem) {
      // Only attach mm/mu when there is a selected item
      if(!oldItem && newItem) {
        doc.addEventListener(getTouchy('mousemove'), this.onMousemove, {passive:false})
        doc.addEventListener(getTouchy('mouseup'), this.onMouseup)
      } else if(oldItem && !newItem) {
        doc.removeEventListener(getTouchy('mousemove'), this.onMousemove, {passive:false})
        doc.removeEventListener(getTouchy('mouseup'), this.onMouseup)
      }
    }
  },
  render() {
    const debugOut = () => (
      <div class="dnd-ctx-db">
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
        index: this.selIt.idx
      }
      return (
        <div class="dnd-ctx dnd-ctx-drg">
          {content}
          <div class="dnd-drag" style={this.dragItemStyle}>
            {dndItemSlot(slotArg)}
          </div>
        </div>)
    } else {
      return <div class="dnd-ctx">{content}</div>
    }
  }
}
