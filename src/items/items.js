import {default as DnDItem, DnDItemEventPayload} from '../item/item'
import DnDHandle from '../handle/handle'
import bus from '../bus'
import {
  DND_ITEM_SELECT,
  DND_ITEM_SELECTED,
  DND_ITEM_UNSELECTED,
  DND_HANDLE_MD,
  DnDItemSelectPayload
} from '../events'
import {
  indexOfDirectChild,
  findAncestorByClassName
} from '../dom'
import {drop} from './drop'
import DragContext from './dragContext'
import DragState from './dragState'
import DnDOptions from './dndOptions'

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
      type: DnDOptions,
      default: () => new DnDOptions()
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
      dragState: null
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
    displayedItems() {
      if(this.dragState) {
        const ret = this.dropHandler(this.dragState)
        return ret.target.container
      } else {
        return this.items
      }
    }
  },
  methods: {
    setSelectedItem(selectedItem) {
      this.selectedItem = selectedItem
    },
    resetSelectedItem() {
      this.selectedItem = null
      this.dragState = null
    },
    onMousedown(payload) {
      const container = payload.container
      if(this.items !== container) {return}
      const event = payload.event
      const parent = this.$refs.content
      const child = event.target
      const index = indexOfDirectChild(parent, child)
      if(index >= 0 && index < this.items.length) {
        const itemChild = findAncestorByClassName(child, 'mo-dndItem')
        const payload = new DnDItemSelectPayload(
          event, itemChild,
          new DragContext(this.group, this.items, index, this.options, this.emitUpdate))
        bus.$emit(DND_ITEM_SELECT, payload)
      }
    },
    onMouseleave() {
      this.dragState = null
    },
    onMove(dragTargetOrMouseEvent) {
      if(this.selectedItem) {
        const trgIndex = dragTargetOrMouseEvent instanceof DnDItemEventPayload ?
          dragTargetOrMouseEvent.index: 0

        const prevDS = this.dragState // Capture prev drag state
        let sc = null
        let tc = null
        if(prevDS) {
          // Get ref to resulting container of previous drag state
          // This will be used as the source and target of the new drag state
          // Note: If prevDS is not null then isSameContext must be true
          const projContainer = prevDS.resultFn()
          sc = new DragContext(this.group, projContainer, prevDS.targetContext.index, this.options, this.updateFn)
          tc = new DragContext(this.group, projContainer, trgIndex, this.options, this.emitUpdate)
        } else {
          sc = this.selectedItem
          tc = new DragContext(this.group, this.items, trgIndex, this.options, this.emitUpdate)
        }

        const isSameContext = sc.container === tc.container

        // Check permissions
        const sPerms = sc.options.permissions
        const tPerms = tc.options.permissions
        const sAllowsOut = sPerms.out === null || sPerms.out[tc.group]
        const tAllowsIn = tPerms.in === null || tPerms.in[sc.group]

        if(sAllowsOut && tAllowsIn) {
          // Permissions ok
          let shouldInsertBefore = true
          if(dragTargetOrMouseEvent instanceof DnDItemEventPayload) {
            const eventRef = dragTargetOrMouseEvent.event
            const elemRef = dragTargetOrMouseEvent.elem
            const clientRect = elemRef.getBoundingClientRect()

            shouldInsertBefore = eventRef.clientY < clientRect.top+clientRect.height/2
          }

          this.dragState = new DragState(sc, tc, isSameContext, shouldInsertBefore, () => this.displayedItems())
        }
      }
    },
    onUp(dragTargetOrMouseEvent) {
      if(this.dragState) {
        const ret = this.dropHandler(this.dragState)
        if(!ret.sameContext) {
          ret.source.updateFn(ret.source.container)
        }
        ret.target.updateFn(ret.target.container)
      }
    },
    emitUpdate(payload) {
      this.$emit('update', payload)
    }
  },
  render() {
    const dndItemSlot = this.$scopedSlots.default
    const empty = <div class="mo-dndItemsEmpty" onMousemove={this.onMove}>Empty</div>

    const ds = this.dragState
    const tc = ds.targetContext
    const si = this.selectedItem
    const items = this.displayedItems.map((item, index) => {
      // An item may be flagged as selected or projected
      let isSelectedItem = false
      let isProjectedItem = false

      if(ds) {
        // A projected item exists
        if(ds.sameContext) {
          if(ds.insertBefore) {
            isProjectedItem = index === tc.index-1
          } else {
            isProjectedItem = index = tc.index
          }
        } else {
          if(ds.insertBefore) {
            isProjectedItem = index === tc.index
          } else {
            isProjectedItem = index === tc.index+1
          }
        }
      } else if(si) {
        // A selected item exists
        isSelectedItem = si.container === this.items && si.index === index
      }

      const key = this.keyFn ? this.keyFn(item) : index

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
        {this.displayedItems.length > 0 ? items : empty}
        <pre>{JSON.stringify(this.displayedItems, null, 2)}</pre>
      </div>)

    return this.displayedItems.length > 0 && this.options.wrapDnDHandle ?
      <DnDHandle container={this.items}>{content}</DnDHandle>: content
  }
}
