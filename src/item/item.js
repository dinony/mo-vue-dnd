export class DnDItemEventPayload {
  constructor(index) {
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
      return new DnDItemEventPayload(this.index)
    }
  },
  methods: {
    emitOnMouseenter() {
      this.$emit('enter', this.eventPayload)
    },
    emitOnMouseup(event) {
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
