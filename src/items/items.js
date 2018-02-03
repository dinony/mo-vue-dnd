import bus from '../bus'
import {default as DnDItem, ItemEventPayload} from '../item/Item'
import DnDHandle from '../handle/Handle'
import {
  DND_ITEM_SELECT,
  DND_ITEM_SELECTED,
  DND_ITEM_UNSELECTED,
  DND_HANDLE_MD,
  ItemSelectPayload
} from '../events'

import {
  indexOfDirectDescendant,
  findAncestorByClassName
} from '../dom'

import drop from '../drop/drop'

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
      selectedItem: null,
      itemIntersection: null
    }
  },
  mounted() {
    bus.$on(DND_ITEM_SELECTED, this.setSelectedItem)
    bus.$on(DND_ITEM_UNSELECTED, this.resetSelectedItem)
    bus.$on(DND_HANDLE_MD, this.onMousedown)
  },
  beforeDestroy() {
    bus.$off(DND_ITEM_SELECTED, this.setSelectedItem)
    bus.$off(DND_ITEM_UNSELECTED, this.resetSelectedItem)
    bus.$off(DND_HANDLE_MD, this.onMousedown)
  },
  computed: {
    dropPreviewResult() {
      return this.itemIntersection ? this.dropHandler(this.itemIntersection): null
    },
    renderedItems() {
      return this.dropPreviewResult ? this.dropPreviewResult.targetResult.container: this.items
    }
  },
  methods: {
    setSelectedItem(selectedItem) {
      this.selectedItem = selectedItem
    },
    resetSelectedItem() {
      this.selectedItem = null
      this.itemIntersection = null
    },
    onMousedown(payload) {
      const container = payload.container
      if(this.items !== container) {return}
      const event = payload.event
      const parent = this.$refs.content
      const child = event.target
      const index = indexOfDirectDescendant(parent, child)
      if(index >= 0 && index < this.items.length) {
        const itemWrapper = findAncestorByClassName(child, 'mo-dndItem')
        const payload = new ItemSelectPayload(
          event, itemWrapper,
          new ItemContext(this.group, this.items, index, this.options))
        bus.$emit(DND_ITEM_SELECT, payload)
      }
    },
    onMouseleave() {
      this.itemIntersection = null
    },
    onMove(dragTargetOrMouseEvent) {
      if(this.selectedItem) {
        const trgIndex = dragTargetOrMouseEvent instanceof ItemEventPayload ?
          dragTargetOrMouseEvent.index: 0

        // previous drop result
        const pDR = this.dropPreviewResult
        let sc = null
        let tc = null
        if(pDR) {
          // Same context
          const pTarget = pDR.targetContext
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

          if(!pInt || (pInt && !pInt.equals(cInt))) {
            this.itemIntersection = cInt
          }
        }
      }
    },
    onUp(dragTargetOrMouseEvent) {
      if(this.dropPreviewResult) {
        this.dropPreviewResult.sourceResult.update()
        this.dropPreviewResult.targetResult.update()
      }
    },
    emitUpdate(payload) {
      this.$emit('update', payload)
    }
  },
  render() {
    const dndItemSlot = this.$scopedSlots.default
    const empty = <div class="mo-dndItemsEmpty" onMousemove={this.onMove}>Empty</div>

    // Current drop result
    const dr = this.dropPreviewResult
    const tc = dr ? dr.targetContext : null
    const si = this.selectedItem
    const items = this.renderedItems.map((item, index) => {
      // An item may be flagged as selected or projected
      let isSelectedItem = false
      let isProjectedItem = false

      if(tc) {
        // A projected item exists
        isProjectedItem = tc.index === index
      } else if(si) {
        // A selected item exists
        isSelectedItem = si.container === this.items && si.index === index
      }

      const key = this.keyFn ? this.keyFn(item): index

      return (
        <DnDItem item={item} index={index} key={key} keyTest={key}
          isSelected={isSelectedItem}
          isProjected={isProjectedItem}
          onMove={this.onMove} onUp={this.onUp}>
          {dndItemSlot({item, index, container: this.items, isSelectedItem, isProjectedItem})}
        </DnDItem>)
    })

    const content = (
      <div class="mo-dndItems" onMouseleave={this.onMouseleave} onMouseup={this.onUp} ref="content">
        {this.renderedItems.length > 0 ? items : empty}
        <pre>{JSON.stringify(this.renderedItems, null, 2)}</pre>
      </div>)

    return this.renderedItems.length > 0 && this.options.wrapDnDHandle ?
      <DnDHandle container={this.items}>{content}</DnDHandle>: content
  }
}
