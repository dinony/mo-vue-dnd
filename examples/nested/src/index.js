import Vue from 'vue'
import './index.scss'
import {
  DnDContext, DnDItems, DnDOptions
} from 'mo-vue-dnd'
import 'mo-vue-dnd/index.scss'
// import 'mo-vue-dnd/mo-vue-dnd.css'

import {
  LeafItem, ContainerItem
} from './left/left'
import {
  LeafNode, IntermediateNode
} from './right/right'
import {
  LEFT_GRP, leftOptions,
  RIGHT_GRP, rightOptions
} from './config'

new Vue({
  el: '#app',
  data() {
    return {
      left: [
        new LeafItem('Leaf'),
        new ContainerItem('Container'),
        new LeafItem('Leaf 2'),
      ],
      right: [
        new IntermediateNode()
      ]
    }
  },
  methods: {
    updateLeft(left) {
      this.left = left
    },
    updateRight(right) {
      this.right = right
    },
    getObjId(obj) {
      return obj.id
    }
  },
  render(h) {
    const slots = {
      default: props => props.item.renderFn(h, props)
    }
    return (
      <DnDContext scopedSlots={slots}>
        <div class="wrapper">
          <div class="left">
            <DnDItems
              group={LEFT_GRP}
              items={this.left}
              options={leftOptions}
              onUpdate={this.updateLeft}
              keyFn={this.getObjId}
              scopedSlots={slots}/>
          </div>
          <div class="right">
            <DnDItems
              group={RIGHT_GRP}
              items={this.right}
              options={rightOptions}
              onUpdate={this.updateRight}
              keyFn={this.getObjId}
              scopedSlots={slots}/>
          </div>
        </div>
      </DnDContext>
    )
  }
})
