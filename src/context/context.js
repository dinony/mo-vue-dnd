import './context.scss'
import bus from '../bus'
import {
  DND_ITEM_SELECTED,
  DND_ITEM_UNSELECTED
} from '../events'

const StateEnum = {
  INIT: 0,
  SELECTED: 1
}

export default {
  props: {
    debug: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      state: StateEnum.INIT,
      selected: null,
      mousePos: null
    }
  },
  mounted() {
    bus.$on(DND_ITEM_SELECTED, this.setSelectedState)
    bus.$on(DND_ITEM_UNSELECTED, this.setInitState)
  },
  beforeDestroy() {
    bus.$off(DND_ITEM_SELECTED, this.setSelectedState)
    bus.$off(DND_ITEM_UNSELECTED, this.setInitState)
  },
  methods: {
    setSelectedState({event, payload, clientRect}) {
      this.state = StateEnum.SELECTED
      this.selected = payload
      this.mousePos = {
        x: clientRect.left,
        y: clientRect.top
      }
    },
    setInitState() {
      this.state = StateEnum.INIT
      this.selected = null
    },
    onDnDItemMousemove: function(event) {
      console.log('mousemove')
      this.mousePos = {
        y: event.pageY,
        x: event.pageX
      }
    }
  },
  render() {
    const debugOut = () => {
      return (
        <div class="mo-dndContextDebug">
          <h4>mo-vue-dnd</h4>
          <pre>State: {this.state}</pre>
          <pre>{this.selected ? JSON.stringify(this.selected.item, null, 2): null}</pre>
        </div>)
    }

    const common = (<div>
      {this.debug ? debugOut() : ''}
      {this.$slots.default}
    </div>)

    if(this.state === StateEnum.SELECTED) {
      const dndItemStyle = {
        top: this.mousePos.y+'px',
        left: this.mousePos.x+'px'
      }
      const dndItemSlot = this.$scopedSlots.default
      return (
        <div class="mo-dndContext mo-dndSelected" onMouseup={this.setInitState} onMousemove={this.onDnDItemMousemove}>
          {common}
          <div class="mo-dndSelectedItem" style={dndItemStyle}>
            {dndItemSlot({item: this.selected.item, index: this.selected.index})}
          </div>
        </div>)
    } else {
      return <div class="mo-dndContext">{common}</div>
    }
  }
}
