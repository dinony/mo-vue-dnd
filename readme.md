# mo-vue-dnd

[![npm](https://img.shields.io/npm/v/mo-vue-dnd.svg)](https://www.npmjs.com/package/mo-vue-dnd)

![size](http://img.badgesize.io/https://unpkg.com/mo-vue-dnd/dist/mo-vue-dnd.umd.js?label=size)

![gzip size](http://img.badgesize.io/https://unpkg.com/mo-vue-dnd/dist/mo-vue-dnd.umd.js?label=gzip%20size&compression=gzip)

![module formats: umd](https://img.shields.io/badge/module%20formats-umd%2C%20cjs%2C%20esm-green.svg)


Todo

# Upgrade

Breaking changes in minor/major releases are documented here.

## 0.2.x -> 0.3.x

### DnDItems: Scoped Slot Argument

New:
```JavaScript
{
  item,
  index,
  componentContext
}
```

Old:
```JavaScript
{
  item,
  index,
  container,
  isSelectedItem,
  isProjectedItem
}
```

### DnDHandle: Props

The `DnDItems` component context is used to uniquely address the according `DnDItems` component.
Previously, the container reference was used to identify, which component is affected by the `DnDHandle` selection.
Note that the `componentContext` in the scoped slot argument may be used.

New:

```JSX
<DnDHandle componentContext={dndItemsContext}/>
```

Old:

```JSX
<DnDHandle container={someContainerRef}/>
```

