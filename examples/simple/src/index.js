import Vue from 'vue'

debugger
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
    debugger
    const slots = {
      default: props => <div class="dndItem">Index: {props.index}, Item: {props.item}</div>
    }

    return (
      <DnDContext debug={true} scopedSlots={slots}>
        <div class="dndWrapper">
          <DnDItems items={this.left} scopedSlots={slots}/>
          <DnDItems items={this.right} scopedSlots={slots}/>
        </div>
      </DnDContext>
    )
  }
})
