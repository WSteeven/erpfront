// Dependencias
import { configuracionColumnasTareas } from '../domain/configuracionColumnasTareas'
import { useTareaStore } from 'stores/tarea'
import { defineComponent, ref } from 'vue'

// Componentes
import SubtareasListadoContent from 'pages/tareas/controlTareas/modules/subtareasListadoContent/view/SubtareasListadoContent.vue'
import GeneralContent from 'pages/tareas/controlTareas/modules/GeneralContent/view/GeneralContent.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TareaController } from '../infraestructure/TareaController'
import { Tarea } from '../domain/Tarea'

export default defineComponent({
  name: 'TareaPage',
  components: {
    TabLayout,
    GeneralContent,
    SubtareasListadoContent,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(Tarea, new TareaController())

    const { entidad: tarea, disabled, accion } = mixin.useReferencias()
    const { onConsultado, onGuardado } = mixin.useHooks()

    const step = ref(1)

    const tareaStore = useTareaStore()
    onConsultado(() => {
      tareaStore.tarea = tarea
      tareaStore.accion = accion
    })

    onGuardado(() => {
      tareaStore.tarea = tarea
      tareaStore.accion = accion
    })

    return {
      mixin,
      disabled,
      accion,
      tarea,
      configuracionColumnas: configuracionColumnasTareas,
      //
      step,
      done1: ref(false),
      done2: ref(false),
      done3: ref(false),
      done4: ref(false),
      tabSeleccionado: ref('tarea'),
    }
  },
})
