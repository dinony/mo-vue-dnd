import bus from '../bus'
import DnDItem from '../item/Item'
import DnDHandle from '../handle/Handle'
import {
  DND_ITEM_TRACED,
  DND_ITEM_SELECT,
  DND_ITEM_SELECTED,
  DND_TARGET_SELECTED,
  DND_TARGET_UNSELECTED,
  DND_ITEM_UNSELECTED,
  DND_MOVE_TRACE
  // DND_HANDLE_MD,
  // DND_ITEM_SELECT,
  // DND_REQUEST_ITEM,
  // DND_REQUESTED_ITEM,
  // DND_ITEM_SELECTED,
  // DND_ITEM_UNSELECTED,
  // ItemSelectPayload,
  // DND_TARGET_SELECT,
  // DND_TARGET_SELECTED,
  // DND_REQUEST_TARGET,
  // DND_REQUESTED_TARGET,
  // DND_TARGET_UNSELECT,
  // DND_TARGET_UNSELECTED,
  // DND_TARGET_ITEM_CONTEXT,
  // TargetSelectPayload,
  // TargetItemContextPayload
} from '../events'

import {
  indexOfDirectDescendant,
  findAncestorByClassName,
  isDescendant,
  indexOf
} from '../dom'

import {getEventCoords} from '../event'

import {
  default as trace,
  TraceResult, EmptyTraceResult
} from '../trace'

import attachTouchy from '../touch'

import drop from '../drop/drop'

import ItemsContext from './ItemsContext'
import ItemCtx from './ItemContext'
import ItemIntersection from './ItemIntersection'
import Options from './Options'

export default {
  props: {
    name: {
      type: String,
      default: 'outer'
    },
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
  },
  beforeDestroy() {
    bus.$off(DND_ITEM_TRACED, this.onItemTraced)
    bus.$off(DND_ITEM_SELECTED, this.onItemSelected)
    bus.$off(DND_ITEM_UNSELECTED, this.onItemUnselected)
    bus.$off(DND_TARGET_SELECTED, this.onTargetSelected)
    bus.$off(DND_TARGET_UNSELECTED, this.onTargetUnselected)
    bus.$off(DND_MOVE_TRACE, this.onMoveTrace)
  },
  computed: {
    dropPreviewResult() {
      return this.itInt ? this.dropHandler(this.itInt): null
    },
    renderedItems() {
      return this.dropPreviewResult ? this.dropPreviewResult.targetResult.container: this.items
    }
  },
  watch: {
    dropPreviewResult(dr) {
      if(dr && !dr.sameContext && !this.origSrcRes) {
        this.origSrcRes = dr.sourceResult
      } else if(!dr) {
        this.origSrcRes = null
      }
    }
  },
  methods: {
    onItemTraced(traceRes) {
      if(this.$refs.selfRef !== traceRes.tContainer) {return}
      const itemIndex = traceRes.iIndex
      bus.$emit(DND_ITEM_SELECT, new ItemCtx(this.group, this.items, itemIndex, this.options, this.emitUpdate))
    },
    onItemSelected(itemCtx) {
      this.selIt = itemCtx
    },
    onItemUnselected() {
      this.selIt = null
    },
    onTargetSelected(trgElem) {
      this.selTrg = trgElem
      if(trgElem === this.$refs.selfRef) {
        this.isTrg = true
      } else {
        this.isTrg = false
        this.itInt = null
      }
    },
    onTargetUnselected() {
      this.selTrg = null
      this.isTrg = false
    },
    onMoveTrace(traceResult) {
      if(this.$refs.selfRef !== traceResult.tContainer) {return}

      const trgIndex = traceResult.iIndex

      // previous drop result
      const pDR = this.dropPreviewResult
      const pTarget = pDR ? pDR.targetContext: null
      let sc = null
      let tc = null
      if(pDR) {
        // Same context
        sc = pTarget
        tc = new ItemCtx(this.group, pTarget.container, trgIndex, this.options, this.emitUpdate)
      } else {
        sc = this.selIt
        tc = new ItemCtx(this.group, this.items, trgIndex, this.options, this.emitUpdate)
      }

      if(tc.allowsDrop(sc)) {
        // Permissions ok
        const eventCoords = getEventCoords(traceResult.ev)
        const itemRect = traceResult.tItem.getBoundingClientRect()

        const shouldInsertBefore = eventCoords.clientY < itemRect.top+itemRect.height/2

        // Previous intersection and current intersection
        const pInt = this.itInt
        const cInt = new ItemIntersection(sc, tc, shouldInsertBefore)

        if(pTarget) {
          // Check whether new intersection would output same drop result
          const newTargetIndex = null
          if(sc.index < tc.index) {
            newTargetIndex = shouldInsertBefore ? tc.index-1: tc.index
          } else if(sc.index > tc.index) {
            newTargetIndex = shouldInsertBefore ? tc.index: tc.index+1
          } else {
            newTargetIndex = tc.index
          }

          if(pTarget.index === newTargetIndex) {
            return
          }
        } else if(pInt && pInt.equals(cInt)) {
          return
        }

        // New intersection
        this.itInt = cInt
      }
    }
  },
  render() {
    const dndItemSlot = this.$scopedSlots.default

    // Current drop result
    const dr = this.dropPreviewResult
    const tIndex = dr ? dr.targetContext.index: -1
    const si = this.selectedItem
    const sIndex = si && !dr ? si.index: -1
    const isSelectedContainer = si ? si.container === this.items: false
    const items = this.renderedItems.map((item, index) => {
      // An item may be flagged either as selected or projected
      const isProjectedItem = index === tIndex
      const isSelectedItem = index === sIndex && isSelectedContainer

      const key = this.keyFn ? this.keyFn(item): index

      return (
        <DnDItem key={key}
          isSelected={isSelectedItem}
          isProjected={isProjectedItem}>
          {dndItemSlot({item, index, componentContext: this.ownContext})}
        </DnDItem>)
    })

    const empty = <div class="mo-dndContainerEmpty">Empty</div>
    const cls = {'mo-dndContainer': true, 'mo-dndTarget': this.isTarget}
    const content = (
      <div ref="selfRef" class={cls}>
        {this.renderedItems.length > 0 ? items : empty}
      </div>)

    return this.renderedItems.length > 0 && this.options.wrapDnDHandle ?
      <DnDHandle>{content}</DnDHandle>: content
  }
}
