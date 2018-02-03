import Relation from './Relation'

export default class ItemIntersection extends Relation {
  constructor(sourceContext, targetContext, insertBefore) {
    super(sourceContext, targetContext)
    this.insertBefore = insertBefore
  }
}
