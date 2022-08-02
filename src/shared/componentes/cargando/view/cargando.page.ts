import {defineComponent} from "vue"
import {Cargando} from "../application/cargando.application"

export default defineComponent({
  setup() {
    const cargando = new Cargando()
    return {cargando}
  },
})
