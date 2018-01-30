import {DnDOptions} from 'mo-vue-dnd'
import {
  RIGHT_GRP, LeafNode, IntermediateNode
} from '../right/right'

export const LEFT_GRP = 'left'
export const leftOptions = new DnDOptions()
leftOptions.cloneItemFn = item => item
leftOptions.permissions = [
  [],
  [RIGHT_GRP]
]

class Item {
  constructor(label) {
    this.label = label
  }

  // Abstract: override in subclasses
  nodeFactory() {
    return null
  }

  renderFn(h) {
    return <div>{this.label}</div>
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
