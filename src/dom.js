import {isTouch} from './touch'

function indexOf(child, parent) {
  return Array.prototype.indexOf.call(parent.children, child)
}

function getDirectChild(parent, child) {
  return child === null || child.parentNode === parent ? child : getDirectChild(parent, child.parentNode)
}

export function indexOfDirectDescendant(parent, child) {
  const dChild = getDirectChild(parent, child)
  return indexOf(dChild, parent)
}

export function findAncestorByClassName(child, clsName) {
  return child.parentNode.className.indexOf(clsName) !== -1 ?
    child.parentNode :
    findAncestorByClassName(child.parentNode, clsName)
}

export function isDescendant(parent, child) {
  if(child.parentNode) {
    return child.parentNode !== parent? isDescendant(parent, child.parentNode): true
  } else {
    return false
  }
}
