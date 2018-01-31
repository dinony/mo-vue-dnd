import {DnDOptions} from 'mo-vue-dnd'
import './left.scss'
import {
  LeafNode, IntermediateNode
} from '../right/right'
import {leftOptions} from '../config'

const itemCounter = 0

class Item {
  constructor(label) {
    this.label = label
    this.id = `item-${itemCounter++}`
  }

  // Abstract: override in subclasses
  nodeFactory() {
    return null
  }

  renderFn(h) {
    return <div class="left-item">{this.label}</div>
  }
}

export class LeafItem extends Item {
  constructor(label) {
    super(label)
  }
  nodeFactory() {
    return new LeafNode()
  }
}

export class ContainerItem extends Item {
  constructor(label) {
    super(label)
  }
  nodeFactory() {
    return new IntermediateNode()
  }
}
