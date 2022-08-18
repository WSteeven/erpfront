import { provincias, ciudades } from 'src/config/utils'
import { useTareaStore } from 'src/stores/tarea'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const tareaStore = useTareaStore()
    const tarea = tareaStore.tarea
    tarea.georeferencia_x = '0°14\'13.00"S'
    tarea.georeferencia_y = '79°10\'33.84"W'

    function enviar() {
      //
    }

    return { tarea, provincias, ciudades, enviar }
  },
})
