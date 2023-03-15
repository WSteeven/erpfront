import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { defineComponent, UnwrapRef } from 'vue'

// Componentes
import EstadosSubtareas from 'components/tables/view/EstadosSubtareas.vue'

export default defineComponent({
  props: {
    disable: Boolean,
    subtarea: {
      type: Object as () => UnwrapRef<Subtarea>,
      default: null,
    },
  },
  components: {
    EstadosSubtareas
  },
  setup() {

    return {
      //
    }
  }
})
