// Dependencias
import { configuracionColumnasSubtareas } from 'tareas/controlTareas/modules/subtareasListadoContent/domain/configuracionColumnasSubtareas'
import { required } from '@vuelidate/validators'
import { defineComponent, reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { tiposJornadas } from 'config/utils'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ReporteTrabajoRealizadoController } from '../infraestructure/ReporteTrabajoRealizadoController'
import { TareaController } from 'pages/tareas/controlTareas/infraestructure/TareaController'
import { GrupoController } from 'pages/tareas/grupos/infraestructure/GrupoController'
import { ReporteControlMaterial } from '../domain/ReporteControlMaterial'
import { FiltroReporteMaterial } from '../domain/FiltroReporteMaterial'

export default defineComponent({
  components: { TabLayout, EssentialTable, SelectorImagen },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      ReporteControlMaterial,
      new ReporteTrabajoRealizadoController()
    )

    const { listadosAuxiliares, listado } = mixin.useReferencias()
    const { cargarVista, obtenerListados, listar } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        tareas: {
          controller: new TareaController(),
          params: { campos: 'id,codigo_tarea,detalle,cliente_id' }
        },
        grupos: {
          controller: new GrupoController(),
          params: { campos: 'id,nombre' }
        }
      })
    })

    const filtroReporteMaterial = reactive(new FiltroReporteMaterial())

    // Reglas de validacion
    const reglas = {
      tarea: { required },
      grupo: { required },
      fecha: { required },
    }

    const v$ = useVuelidate(reglas, filtroReporteMaterial)

    async function consultarReporte() {
      if (await v$.value.$validate())
        listar(filtroReporteMaterial)
    }

    return {
      v$,
      mixin,
      listar,
      listado,
      filtroReporteMaterial,
      listadosAuxiliares,
      configuracionColumnasSubtareas,
      tiposJornadas,
      consultarReporte,
    }
  },
})
