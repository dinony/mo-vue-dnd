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
        const ret = this.dropHandler(this.dragState, false)
        return ret.needsUpdate ? ret.target.container : this.items
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
    onEnter(dragTargetOrMouseEvent) {
      if(this.selectedItem) {
        const sc = this.selectedItem
        const isSameContext = sc.container === this.items

        const trgIndex = dragTargetOrMouseEvent instanceof DnDItemEventPayload ?
          dragTargetOrMouseEvent.index: 0

        const isSelfDrop = isSameContext && sc.index === trgIndex
        if(isSelfDrop) {return}

        const trgOptions = this.options
        const trgGroup = this.group

        // check permissions
        const sPerms = sc.options.permissions
        const tPerms = trgOptions.permissions
        const sAllowsOut = sPerms.out === null || sPerms.out[trgGroup]
        const tAllowsIn = tPerms.in === null || tPerms.in[sc.group]

        if(sAllowsOut && tAllowsIn) {
          // Permissions ok
          const tc = new DragContext(this.group, this.items, trgIndex, trgOptions, this.emitUpdate)

          if(dragTargetOrMouseEvent instanceof DnDItemEventPayload) {
            const eventRef = dragTargetOrMouseEvent.event
            const elemRef = dragTargetOrMouseEvent.elem
            const clientRect = elemRef.getBoundingClientRect()

            const shouldInsertBefore = eventRef.clientY < clientRect.top+(clientRect.height/2)
            console.log('insertBefore', shouldInsertBefore)
            this.dragState = new DragState(sc, tc, isSameContext, shouldInsertBefore)
          } else {
            this.dragState = new DragState(sc, tc, isSameContext, true)
          }
        }
      }
    },
    onUp(dragTargetOrMouseEvent) {
      if(this.dragState) {
        const ret = this.dropHandler(this.dragState)
        if(ret.needsUpdate) {
          if(!ret.sameContext) {
            ret.source.updateFn(ret.source.container)
          }
          ret.target.updateFn(ret.target.container)
        }
      }
    },
    emitUpdate(payload) {
      this.$emit('update', payload)
    }
  },
  render() {
    const dndItemSlot = this.$scopedSlots.default
    const empty = <div class="mo-dndItemsEmpty" onMousemove={this.onEnter}>Empty</div>

    const ds = this.dragState
    const si = this.selectedItem
    const items = this.displayedItems.map((item, index) => {
      let isSelectedItem = false
      let isProjectedItem = false
      if(ds) {
        // Determine whether item is dragged (selected) item
        if(!ds.sameContext && ds.sourceContext.container === this.items) {
          isSelectedItem = si.index === index
        }

        // Determine whether item is projection of selected item in target container
        if(ds.targetContext.container === this.items) {
          if(ds.insertBefore) {
            isProjectedItem = ds.targetContext.index === index
          } else {
            isProjectedItem = ds.targetContext.index+1 === index
          }
        }
      } else if(si) {
        isSelectedItem = si.container === this.items && si.index === index
      }

      const key = this.keyFn ? this.keyFn(item) : index

      return (
        <DnDItem item={item} index={index} key={key}
          isSelected={isSelectedItem}
          isProjected={isProjectedItem}
          onEnter={this.onEnter} onUp={this.onUp}>
          {dndItemSlot({item, index, container: this.items})}
        </DnDItem>)
    })

    const content = (
      <div class="mo-dndItems" onMouseleave={this.onMouseleave} onMouseup={this.onUp} ref="content">
        {this.displayedItems.length > 0 ? items : empty}
      </div>)

    return this.displayedItems.length > 0 && this.options.wrapDnDHandle ?
      <DnDHandle container={this.items}>{content}</DnDHandle>: content
  }
}
