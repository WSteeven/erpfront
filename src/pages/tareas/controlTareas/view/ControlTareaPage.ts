// Dependencias
import { configuracionColumnasTareas } from '../domain/configuracionColumnasTareas'
import { computed, defineComponent, ref } from 'vue'

// Componentes
import TabLayout from 'layouts/TabLayout.vue'
import GeneralContent from 'pages/tareas/controlTareas/modules/GeneralContent/view/GeneralContent.vue'
import SubtareasContent from 'pages/tareas/controlTareas/modules/subtareasContent/view/SubtareasContent.vue'
import ResumenMaterialSolicitadoContent from 'pages/tareas/controlTareas/modules/resumenMaterialesSolicitados/view/ResumenMaterialSolicitadoContent.vue'

import DevolucionMaterialesContent from 'pages/tareas/view/DevolucionMaterialesContent.vue'
import PrefacturasContent from 'pages/tareas/view/PrefacturasContent.vue'

// Logica y controladores
import { Tarea } from '../domain/Tarea'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/contenedorSimple.mixin'
import { TareaController } from '../infraestructure/TareaController'
import { useTareaStore } from 'stores/tarea'

export default defineComponent({
  name: 'TareaPage',
  components: {
    TabLayout,
    GeneralContent,
    SubtareasContent,
    PrefacturasContent,
    DevolucionMaterialesContent,
    ResumenMaterialSolicitadoContent,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(Tarea, new TareaController())

    const { entidad: tarea, disabled, accion } = mixin.useReferencias()
    const { cargarVista, obtenerListados, setValidador } =
      mixin.useComportamiento()

    const { onConsultado } = mixin.useHooks()

    const step = ref(1)
    const done1 = ref(false)
    const done2 = ref(false)
    const done3 = ref(false)

    const tareaStore = useTareaStore()
    onConsultado(() => (tareaStore.tarea = tarea)) //.hydrate(tarea))
    const mostrarFormulario = computed(() => tareaStore.mostrarFormulario)

    return {
      mixin,
      disabled,
      accion,
      tarea,
      configuracionColumnas: configuracionColumnasTareas,
      //
      step,
      done1,
      done2,
      done3,
      mostrarFormulario,
    }
  },
})
