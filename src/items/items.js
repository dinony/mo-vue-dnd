import DnDItem from '../item/item'
import bus from '../bus'
import {
  DND_ITEM_SELECT,
  DND_ITEM_SELECTED,
  DND_ITEM_UNSELECTED
} from '../events'
import {indexOfDirectChild} from '../dom'

export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    equalItemFn: {
      type: Function,
      default: (selection, item) => {
        return selection && selection.item === item
      }
    },
    equalSrcFn: {
      type: Function,
      default: (source, target) => {
        return source && target && source === target
      }
    }
  },
  data() {
    return {
      selectedItem: null,
      dragOverState: null
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
      const ds = this.dragOverState
      if(ds &&
        !(ds.sameSource && ds.sourceIndex === ds.targetIndex)) {
        if(ds.sameSource) {
          // Drop into same list
          if(ds.sourceIndex < ds.targetIndex) {
            return this.items.slice(0, ds.sourceIndex)
              .concat(this.items.slice(ds.sourceIndex+1, ds.targetIndex+1))
              .concat(ds.sourceItem)
              .concat(this.items.slice(ds.targetIndex+1))
          } else {
            return this.items.slice(0, ds.targetIndex)
              .concat(ds.sourceItem)
              .concat(this.items.slice(ds.targetIndex, ds.sourceIndex))
              .concat(this.items.slice(ds.sourceIndex+1))
          }
        } else {
          // Drop into other list
          return this.items.slice(0, ds.targetIndex)
            .concat(ds.sourceItem)
            .concat(this.items.slice(ds.targetIndex))
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
      this.dragOverState = null
    },
    onMousedown(event) {
      // Just left button clicks
      if(event.button !== 0) {return}
      const parent = event.currentTarget
      const child = event.target
      const index = indexOfDirectChild(parent, child)
      if(index >= 0 && index < this.items.length) {
        const clientRect = child.getBoundingClientRect()
        const model = {
          source: this.items,
          item: this.items[index],
          index
        }
        const payload = {event, clientRect, model}
        bus.$emit(DND_ITEM_SELECT, payload)
      }
    },
    onMouseleave() {
      this.dragOverState = null
    },
    onEnter(dragTarget) {
      if(this.selectedItem) {
        this.dragOverState = {
          sameSource: this.equalSrcFn(this.selectedItem.source, this.items),
          source: this.selectedItem.source,
          sourceIndex: this.selectedItem.index,
          sourceItem: this.selectedItem.item,
          target: this.items,
          targetIndex: dragTarget.index,
          targetItem: dragTarget.item
        }
      }
    }
  },
  render() {
    const dndItemSlot = this.$scopedSlots.default

    const content = this.displayedItems.map((item, index) => (
      <DnDItem item={item} index={index} onEnter={this.onEnter}
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
