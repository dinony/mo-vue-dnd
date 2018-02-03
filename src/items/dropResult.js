import Relation from './Relation'

export default class DropResult extends Relation {
  constructor(sourceContext, targetContext, needsUpdate) {
    super(sourceContext, targetContext)
    this.needsUpdate = needsUpdate
  }
}
