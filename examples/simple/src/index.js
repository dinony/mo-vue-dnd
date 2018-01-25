import Vue from 'vue'

import {
  DnDContext, DnDItems,
  DnDOptions, DnDHandle
} from 'mo-vue-dnd'

import './index.scss'

const leftOptions = new DnDOptions(false, false)
const rightOptions = new DnDOptions(true, true)

new Vue({
  el: '#app',
  data() {
    return {
      left: [{label:1}, {label:2}, {label:3}, {label:4}, {label:5}],
      right: [{label: 'A'}, {label: 'B'}, {label: 'C'}, {label: 'D'}]
    }
  },
  methods: {
    updateLeft(updateLeft) {
      this.left = updateLeft
    },
    updateRight(updateRight) {
      this.right = updateRight
    }
  },
  render() {
    const renderDnDItem = props => <div class="dndItem">Item: {props.item.label}</div>
    const slots = {default: renderDnDItem}

    return (
      <DnDContext debug={true} scopedSlots={slots}>
        <div class="container">
          <div class="dndWrapper">
            <DnDItems items={this.left} onUpdate={this.updateLeft} options={leftOptions} scopedSlots={slots}/>
            <DnDItems items={this.right} onUpdate={this.updateRight} options={rightOptions} scopedSlots={slots}/>
          </div>
          <div class="dbWrapper">
            <pre class="db">Left: {JSON.stringify(this.left, 2)}</pre>
            <pre class="db">Right: {JSON.stringify(this.right, 2)}</pre>
          </div>
        </div>
      </DnDContext>)
  }
})
