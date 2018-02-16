import bus from '../bus'

import DnDItem from '../item/Item' // eslint-disable-line no-unused-vars
import DnDMdArea from '../mdarea/MdArea' // eslint-disable-line no-unused-vars

import {
  DND_ITEM_TRACED,
  DND_ITEM_SELECT,
  DND_ITEM_SELECTED,
  DND_TARGET_SELECTED,
  DND_TARGET_UNSELECTED,
  DND_ITEM_UNSELECTED,
  DND_MOVE_TRACE,
  DND_DROP
} from '../events'

import {getEventCoords} from '../event'

import drop from '../drop/drop'

import ItemCtx from './ItemContext'
import ItemIntersection from './ItemIntersection'
import Options from './Options'

export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    group: {
      type: String,
      default: null
    },
    options: {
      type: Options,
      default: () => new Options()
    },
    dropHandler: {
      type: Function,
      required: false,
      default: drop
    },
    keyFn: {
      type: Function,
      required: false
    },
    movesFn: {
      type: Function,
      required: false,
      default: () => true
    },
    permsFn: {
      type: Function,
      required: false,
      default: () => true
    }
  },
  data() {
    return {
      selIt: null, // selected item
      isTrg: false, // isTarget
      itInt: null, // item intersection
      origSrcRes: null // origSourceResult
    }
  },
  beforeMount() {
    bus.$on(DND_ITEM_TRACED, this.onItemTraced)
    bus.$on(DND_ITEM_SELECTED, this.onItemSelected)
    bus.$on(DND_ITEM_UNSELECTED, this.onItemUnselected)
    bus.$on(DND_TARGET_SELECTED, this.onTargetSelected)
    bus.$on(DND_TARGET_UNSELECTED, this.onTargetUnselected)
    bus.$on(DND_MOVE_TRACE, this.onMoveTrace)
    bus.$on(DND_DROP, this.onDrop)
  },
  beforeDestroy() {
    bus.$off(DND_ITEM_TRACED, this.onItemTraced)
    bus.$off(DND_ITEM_SELECTED, this.onItemSelected)
    bus.$off(DND_ITEM_UNSELECTED, this.onItemUnselected)
    bus.$off(DND_TARGET_SELECTED, this.onTargetSelected)
    bus.$off(DND_TARGET_UNSELECTED, this.onTargetUnselected)
    bus.$off(DND_MOVE_TRACE, this.onMoveTrace)
    bus.$off(DND_DROP, this.onDrop)
  },
  computed: {
    // Drop result
    dropRes() {
      return this.itInt ? this.dropHandler(this.itInt): null
    },
    renderedItems() {
      return this.dropRes ? this.dropRes.trgRes.cnt: this.items
    }
  },
  watch: {
    dropRes(dr) {
      if(dr && !dr.sameContext && !this.origSrcRes) {
        this.origSrcRes = dr.srcRes
      } else if(!dr) {
        this.origSrcRes = null
      }
    }
  },
  methods: {
    setInitState() {
      this.selIt = null
      this.isTrg = false
      this.itInt = false
    },
    onItemTraced(traceRes) {
      if(this.$refs.selfRef !== traceRes.tContainer) {return}
      const itemCtx = new ItemCtx(this.group, this.items, traceRes.iIdx, this.options, this.emitUpdate)
      if(this.movesFn(itemCtx)) {
        bus.$emit(DND_ITEM_SELECT, itemCtx)
      }
    },
    onItemSelected(itemCtx) {
      this.selIt = itemCtx
    },
    onItemUnselected() {
      this.setInitState()
    },
    onTargetSelected(trgElem) {
      if(trgElem === this.$refs.selfRef) {
        this.isTrg = true
      } else {
        this.isTrg = false
        this.itInt = null
      }
    },
    onTargetUnselected() {
      this.isTrg = false
      this.itInt = null
    },
    onMoveTrace(traceResult) {
      if(!this.selIt || this.$refs.selfRef !== traceResult.tContainer) {return}

      // previous drop result
      const pDR = this.dropRes
      // previous target context
      const pTarget = pDR ? pDR.trgCtx: null
      let sc = null
      let tc = null
      if(pDR) {
        // Same context
        const trgIndex = traceResult.iIdx >= 0 ? traceResult.iIdx: Math.max(pTarget.cnt.length-1, 0)
        sc = pTarget
        tc = new ItemCtx(this.group, pTarget.cnt, trgIndex, this.options, this.emitUpdate)
      } else {
        const trgIndex = traceResult.iIdx >= 0 ? traceResult.iIdx: Math.max(this.items.length-1, 0)
        sc = this.selIt
        tc = new ItemCtx(this.group, this.items, trgIndex, this.options, this.emitUpdate)
      }

      if(tc.allowsDrop(sc) && this.permsFn(sc, tc)) {
        // Permissions ok
        const eventCoords = getEventCoords(traceResult.ev)
        const itemRect = traceResult.tItem.getBoundingClientRect()

        const shouldInsertBefore = eventCoords.clientY < itemRect.top+itemRect.height/2

        // Previous intersection and current intersection
        const pInt = this.itInt
        const cInt = new ItemIntersection(sc, tc, shouldInsertBefore)

        if(pTarget) {
          // Check whether new intersection would output same drop result
          let newTargetIndex = null
          if(sc.idx < tc.idx) {
            newTargetIndex = shouldInsertBefore ? tc.idx-1: tc.idx
          } else if(sc.idx > tc.idx) {
            newTargetIndex = shouldInsertBefore ? tc.idx: tc.idx+1
          } else {
            newTargetIndex = tc.idx
          }

          if(pTarget.idx === newTargetIndex) {
            return
          }
        } else if(pInt && pInt.equals(cInt)) {
          return
        }
        // New intersection
        this.itInt = cInt
      }
    },
    onDrop() {
      if(this.isTrg && this.dropRes) {
        if(this.origSrcRes) {
          this.origSrcRes.update()
        }

        this.dropRes.trgRes.update()
      }
    },
    emitUpdate(payload) {
      this.$emit('update', payload)
    }
  },
  render() {
    const dndItemSlot = this.$scopedSlots.default

    // Current drop result
    const dr = this.dropRes
    const tIndex = dr ? dr.trgCtx.idx: -1
    const si = this.selIt
    const sIndex = si && !dr ? si.idx: -1
    const isSelectedContainer = si ? si.cnt === this.items: false

    const items = this.renderedItems.map((item, index) => {
      // An item may be flagged either as selected or projected
      const isProjectedItem = index === tIndex
      const isSelectedItem = index === sIndex && isSelectedContainer

      const key = this.keyFn ? this.keyFn(item): index

      return (
        <DnDItem key={key}
          keyVal={key}
          isSelected={isSelectedItem}
          isProjected={isProjectedItem}>
          {dndItemSlot({item, index})}
        </DnDItem>)
    })

    const empty = <div class="dnd-empty">Empty</div>
    const cls = {'dnd-cont': true, 'dnd-trg': this.isTrg}
    const content = (
      <div ref="selfRef" class={cls}>
        {this.renderedItems.length > 0 ? items: empty}
      </div>)

    return this.renderedItems.length > 0 && this.options.wrapDnDHandle ?
      <DnDMdArea>{content}</DnDMdArea>: content
  }
}
