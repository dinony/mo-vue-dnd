import './context.scss'
import bus from './bus'
import {
  DND_ITEM_SELECTED,
  DND_ITEM_UNSELECTED
} from './events'

const StateEnum = {
  INIT: 0,
  SELECTED: 1
}

export default {
  props: ['debug'],
  data() {
    return {
      state: StateEnum.INIT,
      selected: null,
      mousePos: null
    }
  },
  created() {
    bus.$on(DND_ITEM_SELECTED, ({event, payload, clientRect}) => {
      this.state = StateEnum.SELECTED
      this.selected = payload
      this.mousePos = {
        x: clientRect.left,
        y: clientRect.top
      }
    })

    bus.$on(DND_ITEM_UNSELECTED, payload => {
      this.setInitState()
    })
  },
  methods: {
    setInitState() {
      this.state = StateEnum.INIT
      this.selected = null
    },
    onDnDItemMousemove(event) {
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
          <pre>State: {this.state}</pre>
          <pre>{this.selected ? JSON.stringify(this.selected.item, null, 2): null}</pre>
        </div>
      )
    }

    if(this.state === StateEnum.SELECTED) {
      const dndItemStyle = {
        top: this.mousePos.y+'px',
        left: this.mousePos.x+'px'
      }
      const dndItemSlot = this.$scopedSlots.default
      return (
        <div class="mo-dndContext" onMouseup={this.setInitState} onMousemove={this.onDnDItemMousemove}>
          {this.debug ? debugOut() : ''}
          {this.$slots.default}
          <div class="mo-dndSelectedItem" style={dndItemStyle}>
            {dndItemSlot({item: this.selected.item, index: this.selected.index})}
          </div>
        </div>
      )
    } else {
      return (
        <div class="mo-dndContext" onMouseup={this.setInitState}>
          {this.debug ? debugOut() : ''}
          {this.$slots.default}
        </div>
      )
    }
  }
}
