import bus from '../bus'
import DnDItem from '../item/Item'
import DnDHandle from '../handle/Handle'
import {
  DND_TARGET_SELECT,
  DND_TARGET_SELECTED,
  DND_TARGET_UNSELECT,
  DND_TARGET_UNSELECTED,
  TargetSelectPayload,
  DND_ITEM_SELECT,
  DND_ITEM_SELECTED,
  DND_ITEM_UNSELECTED,
  ItemSelectPayload,
  DND_HANDLE_MD,
} from '../events'

import {
  indexOfDirectDescendant,
  findAncestorByClassName,
  isDescendant,
  indexOf
} from '../dom'

import {getEventCoords} from '../event'

import attachTouchy from '../touch'

import drop from '../drop/drop'

import ItemsContext from './ItemsContext'
import ItemContext from './ItemContext'
import ItemIntersection from './ItemIntersection'
import Options from './Options'

export default {
  props: {
    name: {
      type: String,
      default: 'outer'
    },
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
      ownContext: new ItemsContext(this),
      selectedTarget: null,
      isTarget: false,
      selectedItem: null,
      selectedNode: null,
      itemIntersection: null,
      origSourceResult: null
    }
  },
  mounted() {
    bus.$on(DND_HANDLE_MD, this.onItemSelect)
    bus.$on(DND_ITEM_SELECTED, this.onSetSelectedItem)
    bus.$on(DND_ITEM_UNSELECTED, this.onResetSelectedItem)
    bus.$on(DND_TARGET_SELECTED, this.onSetTarget)
    bus.$on(DND_TARGET_UNSELECTED, this.onResetTarget)
    bus.$on(DND_TARGET_ITEM_CONTEXT, this.onTargetItemContext)
  },
  beforeDestroy() {
    bus.$off(DND_HANDLE_MD, this.onItemSelect)
    bus.$off(DND_ITEM_SELECTED, this.onSetSelectedItem)
    bus.$off(DND_ITEM_UNSELECTED, this.onResetSelectedItem)
    bus.$off(DND_TARGET_SELECTED, this.onSetTarget)
    bus.$off(DND_TARGET_UNSELECTED, this.onResetTarget)
    bus.$off(DND_TARGET_ITEM_CONTEXT, this.onTargetItemContext)
  },
  computed: {
    dropPreviewResult() {
      return this.itemIntersection ? this.dropHandler(this.itemIntersection): null
    },
    renderedItems() {
      return this.dropPreviewResult ? this.dropPreviewResult.targetResult.container: this.items
    }
  },
  watch: {
    dropPreviewResult(dr) {
      if(dr && !dr.sameContext && !this.origSourceResult) {
        this.origSourceResult = dr.sourceResult
      } else if(!dr) {
        this.origSourceResult = null
      }
    }
  },
  methods: {
    onItemSelect(payload) {
      if(this.ownContext !== payload.targetComponentContext) {return}
      const event = payload.event
      const parent = this.$refs.content
      const child = event.target
      const index = indexOfDirectDescendant(parent, child)
      if(index >= 0 && index < this.items.length) {
        const itemWrapper = findAncestorByClassName(child, 'mo-dndItem')
        const payload = new ItemSelectPayload(
          event, itemWrapper,
          new ItemContext(this.group, this.items, index, this.options, this.emitUpdate))
        bus.$emit(DND_TARGET_SELECT, new TargetSelectPayload(this.$refs.content))
        bus.$emit(DND_ITEM_SELECT, payload)
      }
    },
    onSetSelectedItem(payload) {
      this.selectedItem = payload.itemContext
      this.selectedNode = payload.elem
    },
    onResetSelectedItem() {
      this.selectedItem = null
      this.selectedNode = null
      this.itemIntersection = null
    },
    emitUpdate(payload) {
      this.$emit('update', payload)
    },
    onSetTarget(payload) {
      this.selectedTarget = payload.targetElement
      if(payload.targetElement === this.$refs.content) {
        this.isTarget = true
      } else {
        this.isTarget = false
        this.itemIntersection = null
      }
    },
    onResetTarget() {
      this.isTarget = false
      this.selectedTarget = null
      this.itemIntersection = null
    },
    onMousemove(event) {
      console.log('mm', this.name)
      const coords = getEventCoords(event)
      if(!coords) {return}

      const elemAtPoint = document.elementFromPoint(coords.pageX, coords.pageY)
      const dndTarget = findAncestorByClassName(elemAtPoint, 'mo-dndContainer')
      if(!dndTarget) {
        bus.$emit(DND_TARGET_UNSELECT)
        return
      }

      if(this.selectedTarget !== dndTarget) {
        bus.$emit(DND_TARGET_SELECT, new TargetSelectPayload(dndTarget))
      }

      const dndItem = findAncestorByClassName(elemAtPoint, 'mo-dndItem')
      const dndItemIndex = indexOf(dndItem, dndTarget)

      if(this.selectedNode === dndItem) {return}
      else if(isDescendant(this.selectedNode, dndItem)) {return}
      else {
        bus.$emit(DND_TARGET_ITEM_CONTEXT, new TargetItemContextPayload(dndTarget, dndItem, dndItemIndex))
      }
    },
    onTargetItemContext(payload) {
      if(payload.targetElem !== this.ownContext.componentRef) {return}
    },
    onMouseup(event) {
      // TODO:
    },
  },
  render() {
    const dndItemSlot = this.$scopedSlots.default

    // Current drop result
    const dr = this.dropPreviewResult
    const tIndex = dr ? dr.targetContext.index: -1
    const si = this.selectedItem
    const sIndex = si && !dr ? si.index: -1
    const isSelectedContainer = si ? si.container === this.items: false
    const items = this.renderedItems.map((item, index) => {
      // An item may be flagged either as selected or projected
      const isProjectedItem = index === tIndex
      const isSelectedItem = index === sIndex && isSelectedContainer

      const key = this.keyFn ? this.keyFn(item): index

      return (
        <DnDItem key={key}
          isSelected={isSelectedItem}
          isProjected={isProjectedItem}>
          {dndItemSlot({item, index, componentContext: this.ownContext})}
        </DnDItem>)
    })

    const data = {
      class: {'mo-dndTarget': this.isTarget},
      on: {}
    }
    if(this.selectedItem) {
      attachTouchy(data.on, 'mousemove', this.onMousemove)
      attachTouchy(data.on, 'mouseup', this.onMouseup)
    }

    const empty = <div class="mo-dndContainerEmpty">Empty</div>

    const content = (
      <div ref="content" class="mo-dndContainer" {...data}>
        {this.renderedItems.length > 0 ? items : empty}
      </div>)

    return this.renderedItems.length > 0 && this.options.wrapDnDHandle ?
      <DnDHandle componentContext={this.ownContext}>{content}</DnDHandle>: content
  }
}
