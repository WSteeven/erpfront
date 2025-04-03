import { useEmpleadoStore } from 'stores/empleado'
import { defineComponent } from 'vue'
import SelectorImagen from 'components/SelectorImagen.vue'

export default defineComponent({
  components: { SelectorImagen },
  props: { alto: { type: String, default: '400px' } },
  setup() {
    /*********
     * Stores
     *********/
    const empleadoStore = useEmpleadoStore()

    return {
      empleado: empleadoStore.empleado
    }
  }
})
