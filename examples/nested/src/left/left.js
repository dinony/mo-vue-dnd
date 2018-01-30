import {DnDOptions} from 'mo-vue-dnd'
import './left.scss'
import {
  LeafNode, IntermediateNode
} from '../right/right'
import {leftOptions} from '../config'

class Item {
  constructor(label) {
    this.label = label
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
