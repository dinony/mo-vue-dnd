import Vue from 'vue'
import './index.scss'
import {
  DnDContext, DnDItems, DnDOptions
} from 'mo-vue-dnd'
import 'mo-vue-dnd/index.scss'
// import 'mo-vue-dnd/mo-vue-dnd.css'

import {
  LeafItem, ContainerItem,
  LEFT_GRP, leftOptions
} from './left/left'
import {LeafNode, IntermediateNode} from './right/right'

new Vue({
  el: '#app',
  data() {
    return {
      left: [
        new LeafItem('A'),
        new LeafItem('B'),
        new LeafItem('C'),
        new LeafItem('D'),
        new LeafItem('E')
      ],
      right: []
    }
  },
  methods: {
    updateLeft(left) {
      this.left = left
    },
    updateRight(right) {
      this.right = right
    }
  },
  render(h) {
    const renderItem = props => {
      return props.item.renderFn(h)
    }
    const slots = {default: renderItem}

    return (
      <DnDContext scopedSlots={slots}>
        <DnDItems
          group={LEFT_GRP}
          items={this.left}
          options={leftOptions}
          onUpdate={this.updateLeft}
          scopedSlots={slots}/>
      </DnDContext>
    )
  }
})
