import bus from '../bus'
import {default as DnDItem, ItemEventPayload} from '../item/Item'
import DnDHandle from '../handle/Handle'
import {
  DND_TARGET_SELECT,
  DND_TARGET_SELECTED,
  DND_TARGET_UNSELECT,
  DND_TARGET_UNSELECTED,
  TargetSelectPayload,
  DND_ITEM_SELECT,
  DND_ITEM_SELECTED,
  DND_ITEM_UNSELECTED,
  ItemSelectPayload,
  DND_HANDLE_MD,
} from '../events'

import {
  indexOfDirectDescendant,
  findAncestorByClassName,
  isDescendant
} from '../dom'

import attachTouchy from '../touch'

import drop from '../drop/drop'

import ItemsContext from './ItemsContext'
import ItemContext from './ItemContext'
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
  mounted() {
    bus.$on(DND_TARGET_SELECTED, this.setTarget)
    bus.$on(DND_TARGET_UNSELECTED, this.resetTarget)
    bus.$on(DND_HANDLE_MD, this.onItemSelect)
    bus.$on(DND_ITEM_SELECTED, this.setSelectedItem)
    bus.$on(DND_ITEM_UNSELECTED, this.resetSelectedItem)
  },
  beforeDestroy() {
    bus.$off(DND_TARGET_SELECTED, this.setTarget)
    bus.$off(DND_TARGET_UNSELECTED, this.resetTarget)
    bus.$off(DND_HANDLE_MD, this.onItemSelect)
    bus.$off(DND_ITEM_SELECTED, this.setSelectedItem)
    bus.$off(DND_ITEM_UNSELECTED, this.resetSelectedItem)
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
    onMouseenter(event) {
      this.emitSelectedTarget()
    },
    onMousemove(event) {
      console.log('dndItems', 'mm')
      if(this.selectedTarget === null) {
        this.emitSelectedTarget()
      }
    },
    onMouseleave() {
      bus.$emit(DND_TARGET_UNSELECT)
    },
    emitSelectedTarget() {
      bus.$emit(DND_TARGET_SELECT, new TargetSelectPayload(this.ownContext))
    },
    setTarget(payload) {
      this.selectedTarget = payload.targetComponentContext
      if(payload.targetComponentContext === this.ownContext) {
        this.isTarget = true
      } else {
        this.isTarget = false
        this.itemIntersection = null
      }
    },
    resetTarget() {
      this.isTarget = false
      this.selectedTarget = null
      this.itemIntersection = null
    },
    onItemSelect(payload) {
      if(this.ownContext !== payload.targetComponentContext) {return}
      const event = payload.event
      const parent = this.$refs.content
      const child = event.target
      const index = indexOfDirectDescendant(parent, child)
      if(index >= 0 && index < this.items.length) {
        const itemWrapper = findAncestorByClassName(child, 'mo-dndItem')
        const payload = new ItemSelectPayload(
          event, itemWrapper,
          new ItemContext(this.group, this.items, index, this.options, this.emitUpdate))
        bus.$emit(DND_TARGET_SELECT, new TargetSelectPayload(this.ownContext))
        bus.$emit(DND_ITEM_SELECT, payload)
      }
    },
    setSelectedItem(payload) {
      this.selectedItem = payload.itemContext
      this.selectedNode = payload.elem
    },
    resetSelectedItem() {
      this.selectedItem = null
      this.selectedNode = null
      this.itemIntersection = null
    },
    onMove(dragTargetOrMouseEvent) {
      if(this.selectedItem && this.isTarget) {
        let trgIndex = 0

        if(dragTargetOrMouseEvent instanceof ItemEventPayload) {
          trgIndex = dragTargetOrMouseEvent.index

          // Check whether outer dnd item drops into it's own nested inner dnd container
          const targetNode = dragTargetOrMouseEvent.elem
          if(isDescendant(this.selectedNode, targetNode)) {return}
        } else {
          if(isDescendant(this.selectedNode, dragTargetOrMouseEvent.target)) {return}
        }

        // previous drop result
        const pDR = this.dropPreviewResult
        const pTarget = pDR ? pDR.targetContext: null
        let sc = null
        let tc = null
        if(pDR) {
          // Same context
          sc = pTarget
          tc = new ItemContext(this.group, pTarget.container, trgIndex, this.options, this.emitUpdate)
        } else {
          sc = this.selectedItem
          tc = new ItemContext(this.group, this.items, trgIndex, this.options, this.emitUpdate)
        }

        if(tc.allowsDrop(sc)) {
          // Permissions ok
          let shouldInsertBefore = true
          if(dragTargetOrMouseEvent instanceof ItemEventPayload) {
            const eventRef = dragTargetOrMouseEvent.event
            const elemRef = dragTargetOrMouseEvent.elem
            const clientRect = elemRef.getBoundingClientRect()

            shouldInsertBefore = eventRef.clientY < clientRect.top+clientRect.height/2
          }

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
            } else {
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
      }
    },
    onUp(dragTargetOrMouseEvent) {
      if(this.dropPreviewResult) {
        if(this.origSourceResult) {
          this.origSourceResult.update()
        }
        this.dropPreviewResult.targetResult.update()
      }
    },
    emitUpdate(payload) {
      this.$emit('update', payload)
    }
  },
  render() {
    const dndItemSlot = this.$scopedSlots.default

    const eListeners = {on: {}}

    attachTouchy(eListeners.on, 'mousemove', this.onMove)

    const empty = <div class="mo-dndItemsEmpty" {...eListeners}>Empty</div>

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
        <DnDItem item={item} index={index} key={key}
          isSelected={isSelectedItem}
          isProjected={isProjectedItem}
          onMove={this.onMove} onUp={this.onUp}>
          {dndItemSlot({item, index, componentContext: this.ownContext})}
        </DnDItem>)
    })

    const listeners = {on: {}}

    attachTouchy(listeners.on, 'mousemove', this.onMousemove)
    attachTouchy(listeners.on, 'mouseup', this.onUp)

    const content = (
      <div ref="content" class="mo-dndItems" onMouseenter={this.onMouseenter} onMouseleave={this.onMouseleave} {...listeners}>
        {this.renderedItems.length > 0 ? items : empty}
      </div>)

    return this.renderedItems.length > 0 && this.options.wrapDnDHandle ?
      <DnDHandle componentContext={this.ownContext}>{content}</DnDHandle>: content
  }
}
