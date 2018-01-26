import Vue from 'vue'
import './index.scss'
import {
  DnDContext, DnDItems
} from 'mo-vue-dnd'

new Vue({
  el: '#app',
  data() {
    return {
      tl: ['TL1', 'TL2', 'TL3'],
      tr: ['TR1', 'TR2', 'TR3', 'TR4'],
      bl: ['BL1', 'BL2'],
      br: ['BR1', 'BR2', 'BR3']
    }
  },
  methods: {
    updateTopLeft(data) {
      this.tl = data
    },
    updateTopRight(data) {
      this.tr = data
    },
    updateBottomLeft(data) {
      this.bl = data
    },
    updateButtomRight(data) {
      this.br = data
    }
  },
  render() {
    const renderItem = props => <div class="dndItem">Item: {props.item}</div>
    const slots = {default: renderItem}

    return (
      <DnDContext scopedSlots={slots}>
        <div class="container">
          <div class="row">
            <DnDItems items={this.tl} onUpdate={this.updateTopLeft} scopedSlots={slots}/>
            <DnDItems items={this.tr} onUpdate={this.updateTopRight} scopedSlots={slots}/>
          </div>
          <div class="row">
            <DnDItems items={this.bl} onUpdate={this.updateBottomLeft} scopedSlots={slots}/>
            <DnDItems items={this.br} onUpdate={this.updateButtomRight} scopedSlots={slots}/>
          </div>
        </div>
      </DnDContext>
    )
  }
})
