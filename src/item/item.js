export class ItemEventPayload {
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
    },
    isProjected: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getEventPayload(event) {
      return new ItemEventPayload(event, this.$el, this.index)
    },
    emitMove(event) {
      this.$emit('move', this.getEventPayload(event))
    },
    emitUp(event) {
      this.$emit('up', this.getEventPayload(event))
    }
  },
  render() {
    const params = {
      class: {
        'mo-dndItem': true,
        'mo-dndItemSelected': this.isSelected,
        'mo-dndItemProjected': this.isProjected
      }
    }

    if(!this.isSelected && !this.isProjected) {
      params.on = {
        mousemove: this.emitMove,
        mouseup: this.emitUp
      }
    }
    return <div {...params}>{this.$slots.default}</div>
  }
}
