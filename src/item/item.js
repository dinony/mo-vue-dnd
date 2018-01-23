import './item.scss'

export class DnDItemEvent {
  constructor(item, index) {
    this.item = item
    this.index = index
  }
}

export default {
  props: {
    item: {
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    eventPayload() {
      return new DnDItemEvent(this.item, this.index)
    }
  },
  methods: {
    emitOnMouseenter() {
      this.$emit('enter', this.eventPayload)
    },
    emitOnMouseup() {
      this.$emit('up', this.eventPayload)
    }
  },
  render() {
    const params = {
      class: {
        'mo-dndItem': true,
        'mo-dndItemSelected': this.isSelected
      },
      on: {
        mouseenter: this.emitOnMouseenter,
        mouseup: this.emitOnMouseup
      }
    }
    return <div {...params}>{this.$slots.default}</div>
  }
}
