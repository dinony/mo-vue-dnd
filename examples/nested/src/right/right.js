import {DnDOptions, DnDItems} from 'mo-vue-dnd'
import './right.scss'
import {rightOptions, RIGHT_GRP} from '../config'

const nodeCounter = 0

class Node {
  constructor() {
    this.id = `node-${nodeCounter++}`
  }

  // Abstract: override in subclasses
  renderFn(h) {
    return <div></div>
  }
}

export class LeafNode extends Node {
  renderFn(h) {
    return <div>Leaf Node</div>
  }
}

export class IntermediateNode extends Node {
  constructor(children=[]) {
    super()
    this.children = children
  }

  setChildren(children) {
    this.children = children
  }

  renderFn(h) {
    const slots = {
      default: props => props.item.renderFn(h)
    }
    return (
      <div class="intermediate-node">
        <h5>Container</h5>
        <DnDItems
          group={RIGHT_GRP}
          items={this.children}
          onUpdate={this.setChildren}
          options={rightOptions}
          keyFn={item => item.id}
          scopedSlots={slots}/>
      </div>
    )
  }
}


