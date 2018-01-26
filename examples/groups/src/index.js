import Vue from 'vue'
import './index.scss'
import {
  DnDContext, DnDItems
} from 'mo-vue-dnd'

new Vue({
  el: '#app',
  data() {
    return {
      a: ['a1', 'a2', 'a3'],
      b: ['b1', 'b2', 'b3', 'b4'],
      c: ['c1', 'c2'],
      d: ['d1', 'd2', 'd3']
    }
  },
  methods: {
    updateTopLeft(data) {
      this.a = data
    },
    updateTopRight(data) {
      this.b = data
    },
    updateBottomLeft(data) {
      this.c = data
    },
    updateButtomRight(data) {
      this.d = data
    }
  },
  render() {
    const renderItem = props => <div class="dndItem">{props.item}</div>
    const slots = {default: renderItem}

    return (
      <DnDContext scopedSlots={slots}>
        <div class="container">
          <div class="row">
            <DnDItems items={this.a} group="a" onUpdate={this.updateTopLeft} scopedSlots={slots}/>
            <DnDItems items={this.b} group="b" onUpdate={this.updateTopRight} scopedSlots={slots}/>
          </div>
          <div class="row">
            <DnDItems items={this.c} group="c" onUpdate={this.updateBottomLeft} scopedSlots={slots}/>
            <DnDItems items={this.d} group="d" onUpdate={this.updateButtomRight} scopedSlots={slots}/>
          </div>
        </div>
      </DnDContext>
    )
  }
})
