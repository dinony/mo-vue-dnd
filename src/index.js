console.log(':D')

import DnDContext from './context'
import DnDItems from './items'

import Vue from 'vue'

new Vue({
  el: '#app',
  data() {
    return {
      left: [1, 2, 3, 4, 5],
      right: ['A', 'B', 'C', 'D']
    }
  },
  render() {
    return (
      <DnDContext>
        <div class="wrapper">
          <DnDItems items={this.left}/>
          <DnDItems items={this.right}/>
        </div>
      </DnDContext>
    )
  }
})
