import DnDItem from '../item/item'
import bus from '../bus'
import {
  DND_ITEM_SELECT,
  DND_ITEM_SELECTED,
  DND_ITEM_UNSELECTED,
  DnDItemSelectPayload
} from '../events'
import {indexOfDirectChild} from '../dom'
import {drop} from '../drop'

export class DragContext {
  constructor(container, index, options, updateFn) {
    this.container = container
    this.index = index
    this.options = options
    this.updateFn = updateFn
  }

  get item() {
    return this.container[this.index]
  }
}

class DragState {
  constructor(sourceContext, targetContext, isSameContext) {
    this.sourceContext = sourceContext
    this.targetContext = targetContext
    this.sameContext = isSameContext
  }
}

export class DnDOptions {
  constructor(
    allowSameContainer=true,
    allowItemRemoval=false) {
    this.allowSameContainer = allowSameContainer
    this.allowItemRemoval = allowItemRemoval
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
  },
  beforeDestroy() {
    bus.$off(DND_ITEM_SELECTED, this.setSelectedItem)
    bus.$off(DND_ITEM_UNSELECTED, this.resetSelectedItem)
  },
  computed: {
    displayedItems() {
      if(this.dragState) {
        const ret = this.dropHandler(this.dragState)
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
          new DragContext(this.items, index, this.options, this.emitUpdate))
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
          new DragContext(this.items, dragTarget.index, this.options, this.emitUpdate),
          this.equalContainerFn(this.selectedItem.container, this.items))
      }
    },
    onUp(dragTarget) {
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
