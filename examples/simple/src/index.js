import Vue from 'vue'

import {DnDContext, DnDItems} from 'mo-vue-dnd'

import './index.scss'

new Vue({
  el: '#app',
  data() {
    return {
      left: [1, 2, 3, 4, 5],
      right: ['A', 'B', 'C', 'D']
    }
  },
  render() {
    const renderDnDItem = props => <div class="dndItem">Index: {props.index}, Item: {props.item}</div>
    const slots = {default: renderDnDItem}

    return (
      <DnDContext debug={true} scopedSlots={slots}>
        <div class="container">
          <div class="dndWrapper">
            <DnDItems items={this.left} scopedSlots={slots}/>
            <DnDItems items={this.right} scopedSlots={slots}/>
          </div>
          <div class="dbWrapper">
            <pre class="db">Left: {JSON.stringify(this.left, 2)}</pre>
            <pre class="db">Right: {JSON.stringify(this.right, 2)}</pre>
          </div>
        </div>
      </DnDContext>)
  }
})
