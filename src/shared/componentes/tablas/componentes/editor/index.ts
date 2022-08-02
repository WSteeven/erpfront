import {defineComponent} from "vue"
import dateCell from "./dateCell.vue"
import numericCell from "./numericCell.vue"
import selectCell from "./selectCell.vue"

export function registrarEditors(): void {
  defineComponent({name: "dateCell", dateCell})
  defineComponent({name: "numericCell", numericCell})
  defineComponent({name: "selectCell", selectCell})
  // Vue.component("selectCell", selectCell)
}
