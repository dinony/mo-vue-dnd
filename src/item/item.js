import './item.scss'

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
    emitOnEnter() {
      this.$emit('enter', this.index)
    }
  },
  render() {
    const params = {
      class: {
        'mo-dndItem': true,
        'mo-dndItemSelected': this.isSelected
      },
      on: {
        mouseenter: this.emitOnEnter
      }
    }
    return <div {...params}>{this.$slots.default}</div>
  }
}
