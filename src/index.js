import Vue from 'vue'

import DnDContext from './context'
import DnDItems from './items'

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
    const slots = {
      default: props => <div class="dndItem">{props}</div>
    }

    return (
      <DnDContext>
        <div class="dndWrapper">
          <DnDItems items={this.left} scopedSlots={slots}/>
          <DnDItems items={this.right} scopedSlots={slots}/>
        </div>
      </DnDContext>
    )
  }
})
