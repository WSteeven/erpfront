import {defineComponent} from "vue"
import tooltipReader from "./tooltipReader.vue"
import renderCheck from "./renderCheck.vue"
import renderDate from "./renderDate.vue"
import renderNumeric from "./renderNumeric.vue"
import renderSelect from "./renderSelect.vue"

export function registrarRenders(): void {
  defineComponent({name: "renderNumeric", renderNumeric})
  defineComponent({name: "renderCheck", renderCheck})
  defineComponent({name: "renderDate", renderDate})
  defineComponent({name: "renderNumeric", renderNumeric})
  defineComponent({name: "renderSelect", renderSelect})
  defineComponent({name: "tooltipReader", tooltipReader})
}
