import './items.scss'
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
    onMousedown({event, container}) {
      if(this.items !== container) {return}
      const parent = this.$refs.content
      const child = event.target
      const index = indexOfDirectChild(parent, child)
      if(index >= 0 && index < this.items.length) {
        const itemChild = findAncestorByClassName(child, 'mo-dndItem')
        const clientRect = itemChild.getBoundingClientRect()
        const payload = new DnDItemSelectPayload(
          event, clientRect,
          new DragContext(this.items, index, this.options, this.emitUpdate))
        bus.$emit(DND_ITEM_SELECT, payload)
      }
    },
    onMouseleave() {
      this.dragState = null
    },
    onEnter(dragTargetOrMouseEvent) {
      if(this.selectedItem) {
        const targetDragContext = dragTargetOrMouseEvent instanceof DnDItemEventPayload ?
          new DragContext(this.items, dragTargetOrMouseEvent.index, this.options, this.emitUpdate):
          new DragContext(this.items, 0, this.options, this.emitUpdate)

        this.dragState = new DragState(
          this.selectedItem,
          targetDragContext,
          this.selectedItem.container === this.items)
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
    const empty = <div class="mo-dndItemsEmpty" onMouseenter={this.onEnter}>Empty</div>

    const items = this.displayedItems.map((item, index) => {
      const si = this.selectedItem
      const ds = this.dragState

      const isSelected = si ? si.container === this.displayedItems && si.index === index: false
      const isDragItem = ds ? ds.targetContext.container === this.items && ds.targetContext.index === index: false

      return (
        <DnDItem item={item} index={index} isSelected={isSelected||isDragItem} onEnter={this.onEnter} onUp={this.onUp}>
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
