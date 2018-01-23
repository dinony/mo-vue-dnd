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
    equalsFn: {
      type: Function,
      default: (selection, item) => {
        return selection && selection.item === item
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
      if(this.dragOverState &&
        !(this.dragOverState.sameSource && this.dragOverState.sourceIndex === this.dragOverState.targetIndex)) {
        if(this.dragOverState.sameSource) {
          // Drop into same list
          if(this.dragOverState.sourceIndex < this.dragOverState.targetIndex) {
            return this.items.slice(0, this.dragOverState.sourceIndex)
              .concat(this.items.slice(this.dragOverState.sourceIndex+1, this.dragOverState.targetIndex+1))
              .concat(this.dragOverState.sourceItem)
              .concat(this.items.slice(this.dragOverState.targetIndex+1))
          } else {
            return this.items.slice(0, this.dragOverState.targetIndex)
              .concat(this.dragOverState.sourceItem)
              .concat(this.items.slice(this.dragOverState.targetIndex, this.dragOverState.sourceIndex))
              .concat(this.items.slice(this.dragOverState.sourceIndex+1))
          }
        } else {
          // Drop into other list
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
    onMouseenter(dragTarget) {
      if(this.selectedItem) {
        this.dragOverState = {
          sameSource: this.selectedItem.source === this.items,
          sourceIndex: this.selectedItem.index,
          sourceItem: this.selectedItem.item,
          targetIndex: dragTarget.index,
          targetItem: dragTarget.item
        }
      }
    }
  },
  render() {
    const dndItemSlot = this.$scopedSlots.default

    const content = this.displayedItems.map((item, index) => (
      <DnDItem item={item} index={index} onEnter={this.onMouseenter}
        isSelected={this.equalsFn(this.selectedItem, item)}>
        {dndItemSlot({item, index})}
      </DnDItem>))

    return (
      <div class="mo-dndItems"
        onMousedown={ev => {this.onMousedown(ev)}}>
        {content}
      </div>)
  }
}
