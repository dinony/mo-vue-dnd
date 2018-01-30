export class DnDItemEventPayload {
  constructor(event, elem, index) {
    this.event = event
    this.elem = elem
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
  methods: {
    getEventPayload(event) {
      return new DnDItemEventPayload(event, this.$el, this.index)
    },
    emitOnMouseenter(event) {
      this.$emit('enter', this.getEventPayload(event))
    },
    emitOnMouseup(event) {
      this.$emit('up', this.getEventPayload(event))
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
