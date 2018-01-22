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
        return selection ? selection.item === item : false
      }
    }
  },
  data() {
    return {
      selectedItem: null
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
  methods: {
    setSelectedItem(selectedItem) {
      this.selectedItem = selectedItem
    },
    resetSelectedItem() {
      this.selectedItem = null
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
    onMouseup(event, index) {
      console.log('up')
    },
    onMouseenter(event, index) {
      console.log('enter')
    }
  },
  render(h) {
    const dndItemSlot = this.$scopedSlots.default

    const content = this.items.map((item, index) => (
      <DnDItem source={this.items} item={item} index={index}
        isSelected={this.equalsFn(this.selectedItem, item)}>
        {dndItemSlot({item, index})}
      </DnDItem>))

    return (
      <div class="mo-dndItems"
        onMousedown={ev => {this.onMousedown(ev)}}
        onMouseup={ev => this.onMouseup(ev)}
        onMouseenter={ev => this.onMouseenter(ev)}>
        {content}
      </div>)
  }
}
