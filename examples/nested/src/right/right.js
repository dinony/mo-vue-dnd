import {DnDOptions} from 'mo-vue-dnd'
import {LEFT_GRP} from '../left/left'

export const RIGHT_GRP = 'right'
const rightOptions = new DnDOptions()
rightOptions.cloneItemFn = node => node
rightOptions.permissions = [
  [LEFT_GRP, RIGHT_GRP],
  [RIGHT_GRP]
]

class Node {
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
    this.slots = {
      default: props => props.item.renderFn()
    }
  }

  setChildren(children) {
    this.children = children
  }

  renderFn(h) {
    return (
      <DnDItems
        group={RIGHT_GRP}
        items={this.children}
        onUpdate={this.setChildren}
        options={rightOptions}
        scopedSlots={this.slots}/>
    )
  }
}


