import bus from '../bus'
import DnDItem from '../item/Item'
import DnDHandle from '../handle/Handle'
import {
  DND_ITEM_SELECTED
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

import {default as trace, TraceResult, EmptyTraceResult} from '../trace'

import attachTouchy from '../touch'

import drop from '../drop/drop'

import ItemsContext from './ItemsContext'
import ItemContext from './ItemContext'
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
      ownContext: new ItemsContext(this),
      selectedTarget: null,
      isTarget: false,
      selectedItem: null,
      selectedNode: null,
      itemIntersection: null,
      origSourceResult: null
    }
  },
  beforeMount() {
    bus.$on(DND_ITEM_SELECTED, this.onItemSelected)
    // bus.$on(DND_HANDLE_MD, this.onItemSelect)
    // bus.$on(DND_ITEM_SELECTED, this.onSetSelectedItem)
    // bus.$on(DND_REQUESTED_ITEM, this.onSetSelectedItem)
    // bus.$on(DND_ITEM_UNSELECTED, this.onResetSelectedItem)
    // bus.$on(DND_TARGET_SELECTED, this.onSetTarget)
    // bus.$on(DND_REQUESTED_TARGET, this.onSetTarget)
    // bus.$on(DND_TARGET_UNSELECTED, this.onResetTarget)
    // bus.$on(DND_TARGET_ITEM_CONTEXT, this.onTargetItemContext)

    // bus.$emit(DND_REQUEST_ITEM)
    // bus.$emit(DND_REQUEST_TARGET)
  },
  beforeDestroy() {
    bus.$on(DND_ITEM_SELECTED, this.onItemSelected)
    // console.log('bd')
    // bus.$off(DND_HANDLE_MD, this.onItemSelect)
    // bus.$off(DND_ITEM_SELECTED, this.onSetSelectedItem)
    // bus.$off(DND_REQUESTED_ITEM, this.onSetSelectedItem)
    // bus.$off(DND_ITEM_UNSELECTED, this.onResetSelectedItem)
    // bus.$off(DND_TARGET_SELECTED, this.onSetTarget)
    // bus.$off(DND_REQUESTED_TARGET, this.onSetTarget)
    // bus.$off(DND_TARGET_UNSELECTED, this.onResetTarget)
    // bus.$off(DND_TARGET_ITEM_CONTEXT, this.onTargetItemContext)
  },
  computed: {
    dropPreviewResult() {
      return this.itemIntersection ? this.dropHandler(this.itemIntersection): null
    },
    renderedItems() {
      return this.dropPreviewResult ? this.dropPreviewResult.targetResult.container: this.items
    }
  },
  watch: {
    dropPreviewResult(dr) {
      if(dr && !dr.sameContext && !this.origSourceResult) {
        this.origSourceResult = dr.sourceResult
      } else if(!dr) {
        this.origSourceResult = null
      }
    }
  },
  methods: {
    onItemSelected(payload) {
      const tContainer = payload.tRes.tContainer
      if(this.$refs.selfRef !== tContainer) {return}
      console.log('listener', this.name)
    },
    onItemSelect(payload) {
      if(this.ownContext !== payload.targetComponentContext) {return}
      const event = payload.event
      const parent = this.$refs.selfRef
      const child = event.target
      const index = indexOfDirectDescendant(parent, child)
      if(index >= 0 && index < this.items.length) {
        const itemWrapper = findAncestorByClassName(child, 'mo-dndItem')
        const payload = new ItemSelectPayload(
          event, itemWrapper,
          new ItemContext(this.group, this.items, index, this.options, this.emitUpdate))
        bus.$emit(DND_TARGET_SELECT, new TargetSelectPayload(this.$refs.selfRef))
        bus.$emit(DND_ITEM_SELECT, payload)
      }
    },
    onSetSelectedItem(payload) {
      this.selectedItem = payload.itemContext
      this.selectedNode = payload.elem
    },
    onResetSelectedItem() {
      this.selectedItem = null
      this.selectedNode = null
      this.itemIntersection = null
    },
    emitUpdate(payload) {
      this.$emit('update', payload)
    },
    onSetTarget(payload) {
      this.selectedTarget = payload.targetElement
      if(payload.targetElement === this.$refs.selfRef) {
        this.isTarget = true
      } else {
        this.isTarget = false
        this.itemIntersection = null
      }
    },
    onResetTarget() {
      this.isTarget = false
      this.selectedTarget = null
      this.itemIntersection = null
    },
    onMousemove(event) {
      console.log('mm')
      const res = trace(event)
      if(res instanceof EmptyTraceResult) {return}
      const dndTarget = res.tContainer
      if(!dndTarget) {
        bus.$emit(DND_TARGET_UNSELECT)
        return
      }

      if(this.selectedTarget !== dndTarget) {
        bus.$emit(DND_TARGET_SELECT, new TargetSelectPayload(dndTarget))
      }

      const dndItem = res.tItem
      const dndItemIndex = res.iIndex

      if(this.selectedNode === dndItem) {return}
      else if(isDescendant(this.selectedNode, dndItem)) {return}
      else {
        bus.$emit(DND_TARGET_ITEM_CONTEXT, new TargetItemContextPayload(event, dndTarget, dndItem, dndItemIndex))
      }
    },
    onTargetItemContext(payload) {
      if(payload.targetElem !== this.$refs.selfRef) {return}
      if(!payload.itemElem) {return}
      const trgIndex = payload.itemIndex

      // previous drop result
      const pDR = this.dropPreviewResult
      const pTarget = pDR ? pDR.targetContext: null
      let sc = null
      let tc = null
      if(pDR) {
        // Same context
        sc = pTarget
        tc = new ItemContext(this.group, pTarget.container, trgIndex, this.options, this.emitUpdate)
      } else {
        sc = this.selectedItem
        tc = new ItemContext(this.group, this.items, trgIndex, this.options, this.emitUpdate)
      }

      if(!sc) {
        console.log(this.name)
      }

      if(tc.allowsDrop(sc)) {
        // Permissions ok
        const eventCoords = getEventCoords(payload.event)
        const clientRect = payload.itemElem.getBoundingClientRect()

        const shouldInsertBefore = eventCoords.clientY < clientRect.top+clientRect.height/2

        // Previous intersection and current intersection
        const pInt = this.itemIntersection
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
        this.itemIntersection = cInt
      }
    },
    onMouseup(event) {
    },
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

    const data = {
      class: {'mo-dndTarget': this.isTarget},
      on: {}
    }
    if(this.selectedItem) {
      attachTouchy(data.on, 'mousemove', this.onMousemove)
      attachTouchy(data.on, 'mouseup', this.onMouseup)
    }

    const empty = <div class="mo-dndContainerEmpty">Empty</div>

    const content = (
      <div ref="selfRef" class="mo-dndContainer" {...data}>
        {this.renderedItems.length > 0 ? items : empty}
      </div>)

    return this.renderedItems.length > 0 && this.options.wrapDnDHandle ?
      <DnDHandle componentContext={this.ownContext}>{content}</DnDHandle>: content
  }
}
