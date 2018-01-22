import DnDItem from '../item/item'
import bus from '../bus'
import {
  DND_ITEM_SELECTED,
  DND_ITEM_UNSELECTED
} from '../events';

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
    }
  },
  render(h) {
    const dndItemSlot = this.$scopedSlots.default

    const content = this.items.map((item, index) => (
      <DnDItem source={this.items} item={item} index={index}
        isSelected={this.equalsFn(this.selectedItem, item)}>
        {dndItemSlot({item, index})}
      </DnDItem>))

    return <div class="mo-dndItems">{content}</div>
  }
}
