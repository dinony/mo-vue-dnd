import DnDItem from '../item/item'
import bus from '../bus'
import {
  DND_ITEM_SELECT,
  DND_ITEM_SELECTED,
  DND_ITEM_UNSELECTED,
  DND_ITEM_DROP,
  DnDItemSelectPayload
} from '../events'
import {indexOfDirectChild} from '../dom'
import {DragContext} from '../context/context'

class DragState {
  constructor(sourceContext, targetContext, isSameContext) {
    this.sourceContext = sourceContext
    this.targetContext = targetContext
    this.sameContext = isSameContext
  }
}

export class DnDOptions {
  constructor(allowSameContainer=true) {
    this.allowSameContainer = allowSameContainer
  }
}

export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    options: {
      type: DnDOptions,
      default: () => new DnDOptions()
    },
    equalItemFn: {
      type: Function,
      default: (selection, item) => {
        return selection && selection.item === item
      }
    },
    equalContainerFn: {
      type: Function,
      default: (source, target) => {
        return source && target && source === target
      }
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
  },
  beforeDestroy() {
    bus.$off(DND_ITEM_SELECTED, this.setSelectedItem)
    bus.$off(DND_ITEM_UNSELECTED, this.resetSelectedItem)
  },
  computed: {
    displayedItems() {
      const ds = this.dragState
      const selfHover = () => ds.sameContext && ds.sourceContext.index === ds.targetContext.index
      if(ds && !selfHover()) {
          const srcIndex = ds.sourceContext.index
          const trgIndex = ds.targetContext.index
          const srcItem = ds.sourceContext.item
          if(ds.sameContext && this.options.allowSameContainer) {
            // Drop into same list
            if(srcIndex < trgIndex) {
              return this.items.slice(0, srcIndex)
                .concat(this.items.slice(srcIndex+1, trgIndex+1))
                .concat(srcItem)
                .concat(this.items.slice(trgIndex+1))
            } else {
              return this.items.slice(0, trgIndex)
                .concat(srcItem)
                .concat(this.items.slice(trgIndex, srcIndex))
                .concat(this.items.slice(srcIndex+1))
            }
          } else if(!ds.sameContext) {
            // Drop into other list
            return this.items.slice(0, trgIndex)
              .concat(srcItem)
              .concat(this.items.slice(trgIndex))
          } else {
            return this.items
          }
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
    onMousedown(event) {
      // Just left button clicks
      if(event.button !== 0) {return}
      const parent = event.currentTarget
      const child = event.target
      const index = indexOfDirectChild(parent, child)
      if(index >= 0 && index < this.items.length) {
        const clientRect = child.getBoundingClientRect()
        const payload = new DnDItemSelectPayload(
          event, clientRect,
          new DragContext(this.items, index))
        bus.$emit(DND_ITEM_SELECT, payload)
      }
    },
    onMouseleave() {
      this.dragState = null
    },
    onEnter(dragTarget) {
      if(this.selectedItem) {
        this.dragState = new DragState(
          this.selectedItem,
          new DragContext(this.items, dragTarget.index),
          this.equalContainerFn(this.selectedItem.container, this.items))
      }
    },
    onUp(dragTarget) {
      // console.log('up', dragTarget)
      if(this.dragState) {
        bus.$emit(DND_ITEM_DROP, this.dragState)
      }
    }
  },
  render() {
    const dndItemSlot = this.$scopedSlots.default

    const content = this.displayedItems.map((item, index) => (
      <DnDItem item={item} index={index} onEnter={this.onEnter} onUp={this.onUp}
        isSelected={this.equalItemFn(this.selectedItem, item)}>
        {dndItemSlot({item, index})}
      </DnDItem>))

    return (
      <div class="mo-dndItems"
        onMousedown={this.onMousedown}
        onMouseleave={this.onMouseleave}>
        {content}
      </div>)
  }
}
