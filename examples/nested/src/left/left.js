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

  renderFn(h) {
    return <div class="left-item">{this.label}</div>
  }

  // Abstract: override in subclasses
  nodeFactory() {
    return null
  }

  // Abstract: override in subclasses
  clone() {
    return null
  }
}

export class LeafItem extends Item {
  constructor(label) {
    super(label)
  }

  nodeFactory() {
    return new LeafNode(this.label)
  }

  clone() {
    return new LeafItem(this.label)
  }
}

export class ContainerItem extends Item {
  constructor(label) {
    super(label)
  }

  nodeFactory() {
    return new IntermediateNode()
  }

  clone() {
    return new ContainerItem(this.label)
  }
}
